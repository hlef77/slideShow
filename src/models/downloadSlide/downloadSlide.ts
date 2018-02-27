export type SLIDECONTENTS = Array<{
    title: string,
    contents: [any]
}>;

export interface SLIDEDATA {
    slide_title: string;
    slide_contents: SLIDECONTENTS;
}

export class DownloadSlide {
    slideData: SLIDEDATA;
}
