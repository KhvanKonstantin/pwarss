// Created by Konstantin Khvan on 7/23/18 11:07 AM

export function extractTextFromHtmlString(html: string) {
    return (new DOMParser()).parseFromString(html, "text/html").documentElement.textContent;
}
