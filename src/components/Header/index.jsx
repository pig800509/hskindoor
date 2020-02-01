import React from 'react';

import { Button, Toolbar } from 'react-md';

export default ({showMenu,authStatus,logout}) => (
  <Toolbar colored fixed title="LBS" nav={<Button icon onClick={showMenu}>menu</Button>} 
          actions={
            authStatus?(<Button key="action" flat onClick={logout}> Logout </Button> ):null
          } />
);