// RULE: NEVER assign keys, IF I ONLY HAVE ONE JSON body or in the server response
const formatRequestOptions = (data: any, contentType?: string, method?: 'POST' | 'PUT'): RequestInit => ({
  method: method || 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': contentType || 'application/json',
  },
});

export default formatRequestOptions;
