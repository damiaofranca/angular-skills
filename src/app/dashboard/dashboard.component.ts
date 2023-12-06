import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { take, finalize } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

type Cards = any[];

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
	private readonly _cards$ = new BehaviorSubject<Cards>([]);
	public readonly cards$ = this._cards$.asObservable();

	private _isLoading = false;
	public get isLoading() {
		return this._isLoading;
	}

	private _occursSomeError = false;
	public get occursSomeError() {
		return this._occursSomeError;
	}

	constructor(private httpClient: HttpClient) {}

	public loadCards(): void {
		this._isLoading = true;

		this.httpClient
			.get<Cards>("/api/skills")
			.pipe(
				take(1),
				finalize(() => {
					this._isLoading = false;
				}),
			)
			.subscribe({
				next: (response) => {
					this._cards$.next(response);
					this._occursSomeError = false;
					//Se quiser ver o erro caso a request falhe, atribuia como true o this._occursSomeError.
				},
				// Não implementado tratamento de erros pois, pois estamos desenvolvendo uma aplicação de testes
				error: () => {
					this._occursSomeError = true;
				},
			});
	}

	ngOnInit() {
		this.loadCards();
	}
}
