// RULE: IF THE PAYLOAD IS A PRIMITIVE VALUE LIKE A STRING OR INTEGER,
// THEN PASS IT THROUGH AS IS. DON'T ASSIGN A KEY TO IT IN THE JSON PAYLOAD
const formatRequestOptions = (data: any, contentType?: string, method?: 'POST' | 'PUT' | 'DELETE'): RequestInit => ({
  method: method || 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': contentType || 'application/json',
  },
});

export default formatRequestOptions;
