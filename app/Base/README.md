# App

The App component bootstraps the web application. It also consists of react
components, hooks, contexts, configs and utils. Each of these can be further
categorized into 3 types:

## Private

The private category is prefixed by `private`.
1. Users should not import anything that is private.
2. Users should not modify anything that is private.

## Other

The other category is not prefixed.
1. Users can import anything that is other.
2. Users should not modify anything that is other.

## Public

The public category is prefixed by `public`.
1. Users can import anything that is public.
2. Users can modify anything that is public.
