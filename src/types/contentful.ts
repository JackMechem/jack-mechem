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
                  image?: {
                    url: string;
                  };
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
              image?: {
                url: string;
              };
            }[];
          };
        }[];
      };
    }[];
  };
}
