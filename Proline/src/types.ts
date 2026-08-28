/**
 * Our typescript types, used throughout the project.
 */

export type Icon =
    | 'Close'
    | 'DownArrow'
    | 'Email'
    | 'Facebook'
    | 'Link'
    | 'Search'
    | 'Share'
    | 'Twitter';

export interface Card {
    title: string;
    url: string;
    body: string;
}

export interface FormField {
    label: string;
    name: string;
    type:
        | 'checkbox'
        | 'email'
        | 'file'
        | 'hidden'
        | 'number'
        | 'radio'
        | 'tel'
        | 'text'
        | 'textarea'
        | 'url';
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    rows?: number;
    allowedFileTypes?: string;
    multipleFiles?: boolean;
    value?: number | string;
}

export interface Button {
    icon?: Icon;
    label: string;
    url?: string;
}

export interface EmailSettings {
    logo: string;
}

export type FormType = {
    action?: string;
    button: Button;
    captcha?: boolean;
    email?: EmailSettings;
    fields: FormField[];
    honeyPot?: boolean;
    method?: 'GET' | 'POST';
    name: string;
    service?: 'drupal' | 'netlify' | 'standard';
    submitType?: 'http' | 'js';
};

export interface MapImage {
    center: string;
    zoom: number;
    height: number;
    width: number;
    markers?: string;
}

export interface MenuItem {
    label: string;
    url: string;
    currentPath: string;
}
