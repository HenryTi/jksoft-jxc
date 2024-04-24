export interface UIStyle {
    "class": string;
    caption: string;
    icon: string;
    iconColor: string;
    format: string;
    edit: 'pop' | 'dropdown' | 'radio';
    fraction: number;
    show: boolean;
    required: boolean;
};
