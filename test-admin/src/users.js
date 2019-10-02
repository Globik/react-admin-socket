import React from 'react';
import {List, Datagrid, TextField, ImageField} from 'react-admin';

export const UserList = props => (
<List {...props}>
<Datagrid rowClick="edit">
<TextField source="id"/>
<ImageField source="avatar"/>
</Datagrid>
</List>
);
