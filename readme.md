# Kirby Delete
Allows you to delete pages containing subpages.  

![Delete](http://github.kleinschmidt.at/kirby-delete/delete.png)

## Installation
To install the plugin, please put it in the `site/plugins` directory.  
The plugin folder must be named `delete`.  
**You don't have to add anything to a blueprint.**

```
site/plugins/
    delete/
        delete.php
        ...
```

### Download
You can download the latest version of the plugin from https://github.com/lukaskleinschmidt/kirby-delete/releases/latest

### With Git
If you are familiar with Git, you can clone this repository from Github into your plugins folder.

```git clone https://github.com/lukaskleinschmidt/kirby-delete.git delete```

### Options
Following options are available.
```php
// config.php
c::set('delete.force.label', l('pages.show.delete'));
c::set('delete.force.icon', 'trash-o');
```

### Panel CSS
If you want to change the appereance put something like this into your [panel.css](https://getkirby.com/docs/developer-guide/panel/css).
```css
/* Sidebar */
a[href*="/delete/force"] {
  color: #b3000a;
}

/* Context menu */
.dropdown-dark .dropdown-list a[href*="/delete/force"] {
  color: #b3000a;
}

.dropdown-dark .dropdown-list a[href*="/delete/force"]:hover,
.dropdown-dark .dropdown-list a[href*="/delete/force"]:hover i {
  color: #b3000a;
}
```
