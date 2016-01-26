import url from 'url'

export default function match (href, routes) {
	const parsed = url.parse(href);

	for (let route of routes) {
		route = Array.isArray(route) ? route[1] : route;
		const matched = route.matcher.match(parsed.pathname);

		if (matched) {
			return {
				handler: route.handler,
				params: matched,
				path: route.path
			}
		}
	}
}
