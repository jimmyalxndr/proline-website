import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import type { HandlerContext, HandlerEvent } from '@netlify/functions';

// The Postmark client is created on import and rejects an empty token.
// This placeholder is never used to send. sendEmail is stubbed below.
if (!process.env.POSTMARK_API_KEY) {
    process.env.POSTMARK_API_KEY = 'test-token-not-used';
}

const { handler, outboundMail } = await import('./submission-created.ts');

const originalSend = outboundMail.sendEmail;
const envKeys = [
    'EMAIL_TO',
    'EMAIL_THE_USER',
    'CONTACT_EMAIL_TO',
    'QUOTE_EMAIL_TO',
    'FACTORY_WALKTHROUGH_EMAIL_TO',
] as const;
const originalEnv = Object.fromEntries(
    envKeys.map(key => [key, process.env[key]])
);

afterEach(() => {
    outboundMail.sendEmail = originalSend;
    for (const key of envKeys) {
        const value = originalEnv[key];
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    }
});

function submission(data: Record<string, string>): HandlerEvent {
    return {
        body: JSON.stringify({
            payload: {
                data,
            },
        }),
    } as HandlerEvent;
}

async function captureRecipient(
    data: Record<string, string>
): Promise<string | undefined> {
    const sent: Array<{ To?: string }> = [];
    outboundMail.sendEmail = (async message => {
        sent.push({
            To: typeof message.To === 'string' ? message.To : undefined,
        });
        return {
            ErrorCode: 0,
            Message: 'OK',
            MessageID: 'test',
            SubmittedAt: '',
            To: typeof message.To === 'string' ? message.To : '',
        };
    }) as typeof outboundMail.sendEmail;

    const result = await handler(submission(data), {} as HandlerContext);
    assert.equal(result?.statusCode, 200);
    assert.equal(sent.length, 1);
    return sent[0]?.To;
}

test('factory-walkthrough submissions go to the fabrication sales inbox', async () => {
    delete process.env.FACTORY_WALKTHROUGH_EMAIL_TO;
    delete process.env.EMAIL_THE_USER;
    process.env.EMAIL_TO = 'inbox@example.com';

    const to = await captureRecipient({
        formName: 'factory-walkthrough',
        name: 'Alex Nguyen',
        email: 'alex@example.com',
        company: 'Example Builders',
        preferred_day: 'Tuesday morning',
    });

    assert.equal(to, 'sales@prolinefab.com.au');
});

test('contact submissions still go to EMAIL_TO', async () => {
    delete process.env.CONTACT_EMAIL_TO;
    delete process.env.EMAIL_THE_USER;
    process.env.EMAIL_TO = 'inbox@example.com';

    const to = await captureRecipient({
        formName: 'contact',
        name: 'Alex Nguyen',
        email: 'alex@example.com',
        message: 'Hello',
    });

    assert.equal(to, 'inbox@example.com');
});

test('another form still goes to EMAIL_TO', async () => {
    delete process.env.QUOTE_EMAIL_TO;
    delete process.env.EMAIL_THE_USER;
    process.env.EMAIL_TO = 'inbox@example.com';

    const to = await captureRecipient({
        formName: 'quote',
        name: 'Alex Nguyen',
        email: 'alex@example.com',
    });

    assert.equal(to, 'inbox@example.com');
});

test('FACTORY_WALKTHROUGH_EMAIL_TO overrides the code recipient', async () => {
    delete process.env.EMAIL_THE_USER;
    process.env.EMAIL_TO = 'inbox@example.com';
    process.env.FACTORY_WALKTHROUGH_EMAIL_TO = 'override@example.com';

    const to = await captureRecipient({
        formName: 'factory-walkthrough',
        name: 'Alex Nguyen',
        email: 'alex@example.com',
    });

    assert.equal(to, 'override@example.com');
});

test('CONTACT_EMAIL_TO still wins for the contact form', async () => {
    delete process.env.EMAIL_THE_USER;
    process.env.EMAIL_TO = 'inbox@example.com';
    process.env.CONTACT_EMAIL_TO = 'contact-override@example.com';

    const to = await captureRecipient({
        formName: 'contact',
        name: 'Alex Nguyen',
        email: 'alex@example.com',
    });

    assert.equal(to, 'contact-override@example.com');
});
