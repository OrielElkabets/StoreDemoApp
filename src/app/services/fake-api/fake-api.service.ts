import { HttpRequest, HttpResponse, HttpErrorResponse, HttpEvent, HttpHeaders, HttpStatusCode } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { NewItem } from "../../models/item";
import { FakeDb } from "./fake-db.service";
import APP_CONFIG from '../../app.config.json'
import { joinPath } from "../../utils/join-path";

@Injectable({
    providedIn: "root"
})
export class FakeApi {
    private readonly fakeDb = inject(FakeDb)

    handle(req: HttpRequest<unknown>) {
        return this.handleReq(req).pipe(map(event => {
            if (event instanceof HttpResponse && !event.ok) {
                throw new HttpErrorResponse({
                    error: { message: event.body },
                    headers: event.headers,
                    status: event.status,
                    statusText: event.statusText,
                    url: event.url ?? undefined
                });
            }
            return event;
        }))
    }

    private handleReq(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
        const url = this.trimBaseUrl(req.url)
        const urlParts = url.split("/")
        const [controller, subRoute1, subRoute2] = urlParts

        if (controller === "items") {
            if (subRoute1 === undefined) return of(new HttpResponse({ status: HttpStatusCode.Ok, body: this.fakeDb.getItems() }))
            else if (subRoute1 === "create") {
                const itemOrRes = this.validateNewItemReqBody(req.body)
                if (itemOrRes instanceof HttpResponse) return of(itemOrRes)

                const item = this.fakeDb.addItem(itemOrRes)
                return of(new HttpResponse({ status: HttpStatusCode.Created, body: item, headers: new HttpHeaders({ location: joinPath(APP_CONFIG.apiRoot, "api/items/", item.id) }) }))
            }
            else if (subRoute1 === "update") {
                if (subRoute2 !== undefined) {
                    const idOrRes = this.parseId(subRoute2)
                    if (idOrRes instanceof HttpResponse) return of(idOrRes)

                    const itemOrRes = this.validateNewItemReqBody(req.body)
                    if (itemOrRes instanceof HttpResponse) return of(itemOrRes)

                    const item = this.fakeDb.updateItem({ id: idOrRes, ...itemOrRes })
                    if (item) return of(new HttpResponse({ status: HttpStatusCode.Ok, body: item }))
                    else return of(new HttpResponse({ status: HttpStatusCode.NotFound, body: `item with id ${idOrRes} was not found!` }))
                }
            }
            else if (subRoute1 === "delete") {
                if (subRoute2 !== undefined) {
                    const idOrRes = this.parseId(subRoute2)
                    if (idOrRes instanceof HttpResponse) return of(idOrRes)

                    this.fakeDb.deleteItem(idOrRes)
                    return of(new HttpResponse({ status: HttpStatusCode.Ok, body: `item with ${idOrRes} removed successfully` }))
                }
            }
            else {
                const idOrRes = this.parseId(subRoute1)
                if (idOrRes instanceof HttpResponse) return of(idOrRes)
                const item = this.fakeDb.getItemById(idOrRes)
                if (item) return of(new HttpResponse({ status: HttpStatusCode.Ok, body: item }))
                else return of(new HttpResponse({ status: HttpStatusCode.NotFound, body: `item with id ${idOrRes} was not found!` }))
            }
        }

        return of(new HttpResponse({ status: HttpStatusCode.NotFound, body: "not found" }))
    }

    private parseId(idStr: string) {
        const id = parseInt(idStr)
        if (isNaN(id)) return new HttpResponse({ status: HttpStatusCode.BadRequest, body: "parameter id must be a number" })
        return id
    }

    private validateNewItemReqBody(body: unknown) {
        const { name, qty, price, description } = (body as any)
        if (typeof name === "string" && typeof qty === "number" && typeof price === "number" && (description === null || typeof description === "string")) {
            return { name, qty, price, description } satisfies NewItem
        }
        else return new HttpResponse({ status: HttpStatusCode.BadRequest, body: "request body was not valid item" })
    }

    private trimBaseUrl(url: string) {
        const root = APP_CONFIG.apiRoot
        let sliceFrom = APP_CONFIG.apiRoot.length
        if (!root.endsWith("/")) sliceFrom++
        return url.slice(sliceFrom)
    }
}