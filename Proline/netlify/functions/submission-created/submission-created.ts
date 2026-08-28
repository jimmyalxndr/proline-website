import type { Handler, HandlerEvent } from '@netlify/functions';
import * as changeCase from 'change-case';
import { encode } from 'html-entities';
import { Attachment, ServerClient } from 'postmark';

// Initialise the Postmark client.
const postmark = new ServerClient(process.env.POSTMARK_API_KEY || '');

/**
 * Sends an email, ran by the submission-created event trigger in Netlify.
 * For more info, see:
 * https://docs.netlify.com/functions/trigger-on-events/#available-triggers.
 */
export const handler: Handler = async function (event: HandlerEvent) {
    // Check if the payload data is present.
    const { payload } = JSON.parse(event.body || '');
    if (!payload) {
        return {
            body: JSON.stringify({ error: 'Error: Missing payload' }),
            statusCode: 400,
        };
    }
    if (!payload.data) {
        return {
            body: JSON.stringify({ error: 'Error: Missing payload data' }),
            statusCode: 400,
        };
    }

    // Check Postmark is setup.
    if (!postmark) {
        return {
            body: JSON.stringify({
                error: 'Error: Failed to initialise Postmark',
            }),
            statusCode: 500,
        };
    }

    const formName = payload.data?.formName || 'online';
    const fallbackFromEmail = 'tech@themarkagency.com.au';
    const fromEmail =
        process.env[`${formName.toUpperCase()}_EMAIL_FROM`] ||
        process.env?.EMAIL_FROM ||
        fallbackFromEmail;
    const toEmail =
        process.env[`${formName.toUpperCase()}_EMAIL_TO`] ||
        process.env?.EMAIL_TO;
    const subject =
        process.env[`${formName.toUpperCase()}_EMAIL_SUBJECT`] ||
        process.env?.EMAIL_SUBJECT ||
        `${changeCase.sentenceCase(formName)} form`;
    const timezone =
        process.env[`${formName.toUpperCase()}_EMAIL_TZ`] ||
        process.env.TZ?.replace(':UTC', 'Australia/Sydney') ||
        'Australia/Sydney';
    const timestamp = new Date().toLocaleString('en-AU', {
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        timeZone: timezone,
        timeZoneName: 'short',
        weekday: 'long',
        year: 'numeric',
    }); // E.g. `Thursday 8 August 2024 at 11:25 pm AEST`.
    const logoImage = payload.data?.logoImage || '';

    // Check we have the required info.
    if (!toEmail || !payload.data) {
        return {
            body: JSON.stringify({ error: 'Error: Missing required data.' }),
            statusCode: 400,
        };
    }

    // Prepare the attachments to send with the email, if set and present.
    const emailAttachments = await getAttachments(payload.data);

    // Build out the email body.
    let textBody = buildEmailBodyText(
        formName,
        subject,
        timestamp,
        removeNonVisibleDataFields(payload.data)
    );
    let htmlBody = await buildEmailBodyHtml(
        formName,
        subject,
        timestamp,
        removeNonVisibleDataFields(payload.data),
        logoImage
    );

    // Prepare the backend email.
    const message = {
        Attachments: emailAttachments || undefined,
        From: payload.data?.name
            ? `✉️ ${payload.data.name} - via ${changeCase.sentenceCase(formName)} form <${fromEmail}>`
            : fromEmail,
        HtmlBody: htmlBody,
        MessageStream: 'outbound',
        ReplyTo: payload.data?.email || undefined,
        Subject: subject,
        TextBody: textBody,
        To: toEmail,
    };

    // Send the email using Postmark.
    try {
        await postmark.sendEmail(message);
    } catch (error: any) {
        // Log and return an error.
        console.error('Error sending email: ', error);
        return {
            body: JSON.stringify({
                error: `Failed to send email: ${error.message}`,
            }),
            statusCode: 500,
        };
    }

    // Now optionally send an email to the user too.
    const sendToUser = Boolean(
        process.env[`${formName.toUpperCase()}_EMAIL_THE_USER`] ||
            process.env?.EMAIL_THE_USER ||
            false
    );
    // If we're NOT sending to the user, return early.
    if (!sendToUser) {
        return { statusCode: 200 };
    }

    // Are we able to send an email to the user though?
    if (
        !payload.data?.email ||
        !payload.data?.email.length ||
        !payload.data.email.includes('.') ||
        !payload.data.email.includes('@')
    ) {
        // Log and just fail silently.
        console.error('Error: Invalid user email address provided.');
        return { statusCode: 200 };
    }

    // Build out the user email body.
    textBody = buildEmailBodyText(
        formName,
        subject,
        timestamp,
        removeNonVisibleDataFields(payload.data),
        true
    );
    htmlBody = await buildEmailBodyHtml(
        formName,
        subject,
        timestamp,
        removeNonVisibleDataFields(payload.data),
        logoImage,
        true
    );

    // Prepare the user email.
    const messageToUser = {
        From: fromEmail,
        HtmlBody: htmlBody,
        MessageStream: 'outbound',
        Subject: subject,
        TextBody: textBody,
        To: payload.data?.email,
    };

    // Send the email using Postmark.
    try {
        await postmark.sendEmail(messageToUser);
        return { statusCode: 200 };
    } catch (error: any) {
        // Log and return an error.
        console.error('Error sending email to user: ', error);
        return {
            body: JSON.stringify({
                error: `Failed to send email to user: ${error.message}`,
            }),
            statusCode: 500,
        };
    }
};

/**
 * Helper function to build the HTML email body for a given form submission.
 */
async function buildEmailBodyHtml(
    formName: string,
    subject: string,
    timestamp: string,
    data: Record<string, any>,
    logoImage = '',
    toUser = false
): Promise<string> {
    // Build out the fields.
    let fieldsHtml = '';
    Object.keys(data).forEach(async key => {
        // Use property for the Document fields.
        let value =
            typeof data[key] === 'string'
                ? encode(data[key])
                : isValidFileField(data[key])
                  ? `<a href="${encode(data[key].url)}">${encode(data[key].filename)} (${encode(bytesToHumanSize(data[key].size))})</a>`
                  : JSON.stringify(data[key], null, 2);

        // Build out the field.
        fieldsHtml += `
            <h2>${changeCase.sentenceCase(key)}</h2>
            <p>${value.replace(/(\r\n|\r|\n)/g, '<br>')}</p>
        `;
    });

    const maxPageWidth = 550;

    // Optionally customise the email with environment variables.
    const colourBg =
        process.env[`${formName.toUpperCase()}_EMAIL_COLOUR_BG`] ||
        process.env?.EMAIL_COLOUR_BG ||
        '#f8f8f8';
    const colourPage =
        process.env[`${formName.toUpperCase()}_EMAIL_COLOUR_PAGE`] ||
        process.env?.EMAIL_COLOUR_PAGE ||
        '#fff';
    const colourText =
        process.env[`${formName.toUpperCase()}_EMAIL_COLOUR_TEXT`] ||
        process.env?.EMAIL_COLOUR_TEXT ||
        '#333';
    const logoHeight = Number(
        process.env[`${formName.toUpperCase()}_EMAIL_LOGO_HEIGHT`] ||
            process.env?.EMAIL_LOGO_HEIGHT ||
            60
    ); // Height in pixels.
    const topMessageText =
        process.env[`${formName.toUpperCase()}_EMAIL_TOP_MESSAGE`] ||
        process.env?.EMAIL_TOP_MESSAGE ||
        '';
    const bottomMessageText =
        process.env[`${formName.toUpperCase()}_EMAIL_BOTTOM_MESSAGE`] ||
        process.env?.EMAIL_BOTTOM_MESSAGE ||
        '';

    // Get the logo image src and alt text.
    const logoSrc = getLogoSrc(logoImage);
    const logoAlt = getLogoAlt(formName);
    const logoImgTag = logoSrc.length
        ? `<br><img src="${logoSrc}" alt="${logoAlt}" height="${logoHeight}" /><br>`
        : '';

    // Optionally add top and bottom messages (for user emails).
    let topMessageHtml = '';
    if (toUser && topMessageText) {
        topMessageHtml = `
            <p class="topMessage">${topMessageText}</p>
        `;
    }
    let bottomMessageHtml = '';
    if (toUser && bottomMessageText) {
        bottomMessageHtml = `
            <br>
            <br>
            <p class="bottomMessage">${bottomMessageText}</p>
        `;
    }

    // Build out and return the email body.
    return `
<!doctype html>
<html>
<head>
<style>
    body {
        background-color: ${colourBg};
        color: ${colourText};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 1rem;
        line-height: 1.2;
        padding: 0.5rem 1.5rem;
    }

    table {
        max-width: ${maxPageWidth}px;
        width: 100%;
        width: calc(100% - 5rem);
        width: clamp(300px, 100%, ${maxPageWidth}px);
    }

    .card {
        background-color: ${colourPage};
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: 2rem auto 0;
        padding: 1.5rem 1.75rem;
    }
    .card-header {
        margin: auto;
        text-align: center;
    }
    .card-header img {
        height: auto;
        margin: 0 auto 1rem;
        max-height: ${logoHeight}px;
        max-width: 100%;
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        text-align: center;
    }
    h1,
    h2 {
        line-height: 1.1;
    }
    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 2.5em auto 0.3em;
    }
    .fields {
        font-size: 1.2rem;
        font-weight: 300;
        margin: 2rem 1.5em;
    }
    .topMessage,
    .bottomMessage {
        font-size: 1.3rem;
        line-height: 1.2;
        margin: 1rem 0;
        text-align: left;
    }

    .under-card {
        margin: 0 auto;
        opacity: 0.6;
        text-align: center;
    }
    .timestamp {
        font-size: 0.75em;
        font-weight: 400;
        line-height: 1;
    }
</style>
<body>
    <table class="card">
        <tr>
            <td class"card-header" style="text-align: center;">
                ${logoImgTag}
                <br>
                <h1>${subject}</h1>
            </td>
        </tr>
        <tr>
            <td>
                <div class="fields">
                    ${topMessageHtml}
                    ${fieldsHtml}
                    ${bottomMessageHtml}
                </div>
            </td>
        </tr>
    </table>
    <table class="under-card"><tr><td>
        <p class-"timestamp">${timestamp}</p>
    </td></tr></table>
</body>
</html>
    `;
}

/**
 * Helper function to build the text email body for a given form submission.
 */
function buildEmailBodyText(
    formName: string,
    subject: string,
    timestamp: string,
    data: Record<string, any>,
    toUser = false
): string {
    const topMessageText =
        toUser &&
        (process.env[`${formName.toUpperCase()}_EMAIL_TOP_MESSAGE`] ||
            process.env?.EMAIL_TOP_MESSAGE ||
            '');
    const bottomMessageText =
        toUser &&
        (process.env[`${formName.toUpperCase()}_EMAIL_BOTTOM_MESSAGE`] ||
            process.env?.EMAIL_BOTTOM_MESSAGE ||
            '');

    // Build out the fields.
    let fieldsText = '';
    Object.keys(data).forEach(async key => {
        // Use property for the Document fields.
        let value =
            typeof data[key] === 'string'
                ? indentLineBreaks(data[key])
                : isValidFileField(data[key])
                  ? `${changeCase.sentenceCase(data[key].type)}: ${data[key].filename} (${bytesToHumanSize(data[key].size)})`
                  : JSON.stringify(data[key], null, 2);
        // Build out the field.
        fieldsText += `    ${changeCase.sentenceCase(key)}: \n`;
        fieldsText += `    ${value} \n\n`;
    });

    // Build out and return the email body.
    return `

${getLogoAlt(formName)} (${process.env.URL})

${subject}

---------------------------------

${topMessageText}


${fieldsText}


${bottomMessageText}

---------------------------------

${timestamp}

    `;
}

/**
 * Helper function to convert bytes to human readable size.
 */
function bytesToHumanSize(bytes: number): string {
    // Return value in bytes if less than 1024.
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    // Return value in kilobytes if less than 1 MB.
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    }

    // Return value in megabytes for 1 MB or more.
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Helper function to get the base64 encoded content of an attachment, from a URL.
 */
async function getAttachmentContent(path: string): Promise<false | string> {
    // Check the URL is valid.
    if (
        !path ||
        !path.length ||
        (!path.startsWith('https://') && !path.startsWith('/'))
    ) {
        console.error('Error: Invalid attachment URL provided: ', path);
        return false;
    }

    // If the path is a local file, read it from the filesystem.
    if (path.startsWith('/')) {
        try {
            const data = require('fs').readFileSync(path);
            return Buffer.from(data).toString('base64');
        } catch (error: any) {
            console.error('Error reading local file: ', error);
            return false;
        }
    }

    // Otherwise, fetch the file from the remote URL.
    const response = await fetch(path);
    const data = await response?.arrayBuffer();
    // Encode the data to base64.
    const content = Buffer.from(data).toString('base64');

    // Return false if the fetch failed, or no data/content was found.
    if (!response?.ok || !data || !content) {
        console.error('Error fetching attachment content: ', response);
        return false;
    }

    return content;
}

/**
 * Helper function to get attachments from the payload data (if any),
 * and return them as an array of Postmark attachments,
 * or false if none are found/flag is not set.
 */
async function getAttachments(
    data: Record<string, any>
): Promise<Attachment[] | false> {
    const formName = data?.formName || 'online';
    const attachments: Attachment[] = [];

    // First, check if the environment variable is set to attach files to the email.
    const attachFiles = Boolean(
        process.env[`${formName.toUpperCase()}_EMAIL_ATTACH_FILES`] ||
            process.env?.EMAIL_ATTACH_FILES ||
            false
    );

    // If there's nothing to attach, return early.
    if (!attachFiles) {
        return false;
    }

    // Then loop through the data fields to find any files to attach.
    for (const key of Object.keys(data)) {
        // Check if the field is a file, and that it's ok to attach it.
        if (isValidFileField(data[key])) {
            // Now fetch the file content (base64 encoded).
            const contentBase64 = await getAttachmentContent(data[key].url);
            if (!contentBase64 || !contentBase64.length) {
                // Skip this loop iteration if the content isn't valid.
                console.error(
                    'Error: Invalid attachment content for field: ',
                    key
                );
                continue;
            }

            // Add the file to the attachments array.
            attachments.push({
                Content: contentBase64,
                ContentLength: data[key].size,
                ContentType: data[key].type,
                Name: data[key].filename,
            } as Attachment);

            // Replace the existing field value object with a simple placeholder.
            const fileExtension = data[key].filename.split('.').pop();
            data[key] = `📎 ${fileExtension.toUpperCase()} attached`;
        }
    }

    // Return the attachments array if any files were found.
    if (attachments.length) {
        return attachments;
    }

    // Otherwise, return false.
    return false;
}

/**
 * Helper function to get the logo's alt text.
 */
function getLogoAlt(formName: string): string {
    const fallbackAlt = 'The Mark Agency';

    // Check if a specific alt text is set for the form.
    const altText =
        process.env[`${formName.toUpperCase()}_EMAIL_LOGO_ALT`] ||
        process.env?.EMAIL_LOGO_ALT ||
        fallbackAlt;

    return altText;
}

/**
 * Helper function to get the logo image src, as a base64 encoded string.
 */
function getLogoSrc(logoImage: string): string {
    const domain = process.env.URL || '';

    // Check URL parts are correct before building the URL.
    if (!domain.length || !logoImage?.length || !logoImage.startsWith('/')) {
        return '';
    }
    const imagePath = new URL(logoImage, domain);

    return imagePath.href;
}

/**
 * Helper function to add indentation to line breaks within a given string.
 */
function indentLineBreaks(str: string): string {
    return str.replace(/\n/g, '\n    ');
}

/**
 * Helper function to check if a data field is for a file.
 * Returns true if it is, false if not.
 */
function isValidFileField(field: Record<string, any>): boolean {
    // Email can be up to 10 MB total, including the text and HTML content, so limit to 9 MB as a buffer.
    const maxFileSize = 9 * 1024 * 1024;

    // File Types blocked by PostMark (https://postmarkapp.com/developer/user-guide/send-email-with-api).
    const forbiddenFileTypes = [
        'vbs',
        'exe',
        'bin',
        'bat',
        'chm',
        'com',
        'cpl',
        'crt',
        'hlp',
        'hta',
        'inf',
        'ins',
        'isp',
        'jse',
        'lnk',
        'mdb',
        'pcd',
        'pif',
        'reg',
        'scr',
        'sct',
        'shs',
        'vbe',
        'vba',
        'wsf',
        'wsh',
        'wsl',
        'msc',
        'msi',
        'msp',
        'mst',
    ];

    const valid =
        (field?.type &&
            field?.url &&
            field?.filename &&
            field?.size <= maxFileSize &&
            !forbiddenFileTypes.includes(field.type)) ||
        false;

    return valid;
}

/**
 * Helper function to remove certain data fields.
 */
function removeNonVisibleDataFields(
    data: Record<string, any>
): Record<string, any> {
    delete data.ip;
    delete data.user_agent;
    delete data.referrer;
    delete data.botField;
    delete data.logoImage;
    delete data.formName;
    delete data['g-recaptcha-response'];

    // Remove any empty fields.
    Object.keys(data).forEach(async key => {
        if (data[key] === '') {
            delete data[key];
        }
    });

    return data;
}
