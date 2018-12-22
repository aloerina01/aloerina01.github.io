const client = algoliasearch('UMH0IQYKJ1', '849f7d868e2a37fc2349cb192bbf6182');
const index = client.initIndex('mf_code');
//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
  { hint: false }, 
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 4 }),
    //value to be displayed in input control after user's suggestion selection
    displayKey: 'name',
    //hash of templates used when rendering dataset
    templates: {
        //'suggestion' templating function used to render a single suggestion
        suggestion: function(suggestion) {
          if (!suggestion._highlightResult.title) {
            // return '<p class="suggestion-no-results">no results found</p>';
            return;
          }
          const title = `<p class="suggestion-title">${suggestion._highlightResult.title.value}</p>`;
          const content = suggestion._highlightResult.content ? `<p class="suggestion-content">${suggestion._highlightResult.content.value}</p>` : '';
          const path = suggestion.url;
          return `<a href="${path}">${title}</a>`;
        }
    }
  }
);