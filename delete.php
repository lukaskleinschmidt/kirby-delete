<?php

if(!function_exists('panel')) return;

$panel = panel();

// Use field assets for the javascript
$kirby->set('field', 'delete', __DIR__ . DS . 'delete');

// Custom delte route
$panel->routes[] = array(
  'pattern' => 'pages/(:all)/delete/force',
  'action'  => function($uid) use($panel) {

    $page       = $panel->page($uid);
    $controller = new Kirby\Panel\Controllers\Base();
    $deletable  = true;

    // Check permission but without checking for subpages
    if($page->isHomePage()) {
      $deletable = false;
    } else if($page->isErrorPage()) {
      $deletable = false;
    } else if($page->blueprint()->deletable() === false) {
      $deletable = false;
    } else if($page->blueprint()->options()->delete() === false) {
      $deletable = false;
    } else {
      $deletable = $page->event('delete:ui')->isAllowed();
    }

    if($deletable === false) {
      throw new Kirby\Panel\Exceptions\PermissionsException();
    }

    $form = $page->form('delete', function($form) use($page, $controller) {
      try {

        if(!$page->isDeletable()) {
          throw new Exception('The page cannot be deleted');
        }

        $parent = $page->parent();

        if(!dir::remove($page->root())) {
          throw new Exception('The page could not be deleted');
        }

        $page->kirby->cache()->flush();
        $parent->reset();

        $controller->notify(':)');
        $controller->redirect($page->parent()->isSite() ? '/' : $page->parent());

      } catch(Exception $e) {
        $form->alert($e->getMessage());
      }
    });

    $form->style('delete');
    $form->cancel($page);

    return $controller->layout('app', array('content' => tpl::load(__DIR__ . DS . 'template.php', compact('form'))));

  },
  'filter'  => 'auth',
  'method'  => 'POST|GET'
);

// Get page delete informations
$panel->routes[] = array(
  'pattern' => 'pages/(:all)/options/delete/(:all?)',
  'action'  => function($uid, $position = 'sidebar') use($panel) {

    $page = $panel->page($uid);

    if($page->options()->delete()) {
      return;
    }

    $url = $page->url('delete/force');

    if($position == 'context') {
      if($page->parent->isSite()) {
        $redirect = '/';
      } else {
        $redirect = $page->parent->uri('edit');
      }
      $url .= '?_redirect=' . $redirect;
    }

    if($page->isHomePage()) {
      return false;
    } else if($page->isErrorPage()) {
      return false;
    } else if($page->blueprint()->deletable() === false) {
      return false;
    } else if($page->blueprint()->options()->delete() === false) {
      return false;
    } else {
      return response::json(array(
        'href'          => $url,
        'label'         => l('pages.show.delete'),
        'icon'          => 'trash-o',
        'title'         => '#',
        'data-shortcut' => '#',
        'data-modal'    => true,
      ));
    }

  },
  'filter'  => 'auth',
  'method'  => 'POST|GET'
);
