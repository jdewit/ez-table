Angular Table Directive
=======================

A simple table directive that requires minimal markup.
This directive is rigid and small (~3kb). 
If you are looking for flexibility, try ngTable, ngGrid, or angular-table.

Features
--------

- filtering 
- checkboxes
- sorting 
- Twitter bootstrap styling

Demo
----

http://plnkr.co/edit/upx6c3?p=preview

Usage 
-----

```html
<table ez-tableable="users">
  <tr ng-repeat="user in items">
    <td><input type="checkbox" ng-model="user.selected"/></td>
    <td data-title="Name">{{ user.name }}</td>
    <td data-title="Display Name" data-field="fullName">{{ user.fullName }}</td>
    <td><a class="btn" ng-click="editUser()">Edit</a></td>
  </tr>
</table>
```
    


