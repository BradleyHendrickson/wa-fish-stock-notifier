import * as React from 'react';


export function EmailTemplate({body}) {

  return (
      <div>
        <h1>Welcome!</h1>
        <p>{body}</p>
      </div>
    );
}