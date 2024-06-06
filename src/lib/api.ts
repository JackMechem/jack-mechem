import {
  PageResponse,
  PageSlugsResponse,
  PagesResponse,
} from "@/types/contentful";

const PAGE_SLUG_QUERY_STRING = `
  items {                                                                                                                                                                                                                         
        sys {                                                                                                                                                                                                                     
           id                                                                                                                                                                                                                      
          }                                                                                                                                                                                                                         
          name                                                                                                                                                                                                                      
          slug                                                                                                                                                                                                                      
        }      
`;

const PAGE_QUERY_STRING = `
  items {                                                                                                                                                                                                                         
        sys {                                                                                                                                                                                                                     
           id                                                                                                                                                                                                                      
          }                                                                                                                                                                                                                         
          name                                                                                                                                                                                                                      
          slug                                                                                                                                                                                                                      
          blocksCollection(limit: 10) {                                                                                                                                                                                                        
            items {                                                                                                                                                                                                                 
             sys {                                                                                                                                                                                                                 
               id                                                                                                                                                                                                                  
             }                                                                                                                                                                                                                     
             name                                                                                                                                                                                                                  
             slug                                                                                                                                                                                                                  
             separators                                                                                                                                                                                                            
             columnsCollection(limit: 3) {                                                                                                                                                                                                   
               items {                                                                                                                                                                                                             
                 sys {                                                                                                                                                                                                             
                   id                                                                                                                                                                                                              
                 }                                                                                                                                                                                                                 
                 name                                                                                                                                                                                                              
                 slug
                rowsCollection(limit: 10) {
                  items {
                    __typename
                    ... on TitleText {
                      titleText
                    }
                    ... on BodyText {
                      bodyText
                    }
                    ... on SubText {
                        text
                    }
                    ... on Command {
                      command
                    }
                    ... on Button {
                      buttonText
                      href
                    }
                    ... on Image {
                      outline
                      image {
                        url
                      }
                    }
                  }
                }
               }                                                                                                                                                                                                                   
             }                                                                                                                                                                                                                     
            }                                                                                                                                                                                                                       
          }                                                                                                                                                                                                                         
        }      
`;

const WORK_QUERY_STRING = `
    items {
        sys {
            id
        }
        title 
        slug
        link
        photo {
                url
        }
        shortDescription
        longDescription
    }
`;

async function fetchGraphQL(query: string) {
  const resp = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      next: { tags: ["pages"], revalidate: 3600 },
    },
  ).then((response) => response.json());

  return resp;
}

export async function getAllPageSlugs(): Promise<PageSlugsResponse> {
  const pages = await fetchGraphQL(
    `query {
        pageCollection(where:{slug_exists: true}, limit: 100, preview: false) {
            ${PAGE_SLUG_QUERY_STRING}
        }
      }`,
  );
  // console.log("Page Data: " + pages.data);
  return pages.data;
}

export async function getAllPages(limit = 10): Promise<PagesResponse> {
  const pages = await fetchGraphQL(
    `query {
        pageCollection(where:{slug_exists: true}, limit: ${limit}, preview: false) {
            ${PAGE_QUERY_STRING}
        }
      }`,
  );
  return pages.data;
}

export async function getAllWorks(limit = 50): Promise<any> {
  const pages = await fetchGraphQL(
    `query {
        workCollection(where:{slug_exists: true}, limit: ${limit}, preview: false) {
            ${WORK_QUERY_STRING}
        }
      }`,
  );
  // console.log(pages);
  return pages.data;
}

export async function getPage(slug: string): Promise<PageResponse> {
  const page = await fetchGraphQL(
    `query {
        pageCollection(where:{slug: "${slug}"}, limit: 1, preview: false) {
            ${PAGE_QUERY_STRING}
        }
      }`,
  );
  // console.log(page);
  return page.data.pageCollection.items[0];
}

export async function getWork(slug: string): Promise<any> {
  const page = await fetchGraphQL(
    `query {
        workCollection(where:{slug: "${slug}"}, limit: 1, preview: false) {
            ${WORK_QUERY_STRING}
        }
      }`,
  );
  // console.log(page);
  return page.data.pageCollection.items[0];
}
