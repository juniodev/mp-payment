import {
	Router
} from 'express'

const rt = Router()

export function Get(router: string) {
	return function (
		target: any, propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		rt.get(router, descriptor.value)
	}
}

export function Post(router: string) {
	return function (
		target: any, propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		rt.post(router, descriptor.value)
	}
}

export {
	rt as routes
}