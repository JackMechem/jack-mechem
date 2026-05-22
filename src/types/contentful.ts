export interface ContentfulImage {
  url: string;
  width: number;
  height: number;
}

export interface Work {
  sys: { id: string };
  title: string;
  slug: string;
  link: string;
  photo: ContentfulImage;
  otherImagesCollection?: { items: ContentfulImage[] };
  shortDescription: string;
  longDescription: string;
  startDate: string;
  endDate: string;
}

export interface WorkCategory {
  category: string;
  worksCollection: { items: Work[] };
}

export interface WorksResponse {
  workCategoryCollection: { items: WorkCategory[] };
}

export interface PagesResponse {
  pageCollection: {
    items: {
      sys: {
        id: string;
      };
      name: string;
      slug: string;
      blocksCollection: {
        items: {
          sys: {
            id: string;
          };
          name: string;
          slug: string;
          separators: boolean;
          columnsCollection?: {
            items: {
              sys: {
                id: string;
              };
              name: string;
              slug: string;
              rowsCollection?: {
                items: {
                  __typename: string;
                  titleText?: string;
                  bodyText?: string;
                  text?: string;
                  command?: string;
                  buttonText?: string;
                  href?: string;
                  outline?: boolean;
                  image?: ContentfulImage;
                }[];
              };
            }[];
          };
        }[];
      };
    }[];
  };
}

export interface PageSlugsResponse {
  pageCollection: {
    items: {
      sys: {
        id: string;
      };
      name: string;
      slug: string;
    }[];
  };
}

export interface PageResponse {
  sys: {
    id: string;
  };
  name: string;
  slug: string;
  blocksCollection: {
    items: {
      sys: {
        id: string;
      };
      name: string;
      slug: string;
      separators: boolean;
      columnsCollection?: {
        items: {
          sys: {
            id: string;
          };
          name: string;
          slug: string;
          rowsCollection?: {
            items: {
              __typename: string;
              titleText?: string;
              bodyText?: string;
              text?: string;
              command?: string;
              buttonText?: string;
              href?: string;
              outline?: boolean;
              image?: ContentfulImage;
            }[];
          };
        }[];
      };
    }[];
  };
}
