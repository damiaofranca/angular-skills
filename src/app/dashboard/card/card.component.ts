import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Input } from "@angular/core";
import { take, finalize } from "rxjs/operators";

import JSConfetti from "js-confetti";

type Card = any;

@Component({
	selector: "app-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
	private _confetti = new JSConfetti();

	private _isLoadingLike = false;
	public get isLoadingLike() {
		return this._isLoadingLike;
	}

	private _occursSomeErrorOnLike = false;
	public get occursSomeErrorOnLike() {
		return this._occursSomeErrorOnLike;
	}

	@Input() card: Card;

	constructor(private readonly _http: HttpClient) {}

	ngOnInit() {}

	onLike() {
		this._isLoadingLike = true;
		this._http
			.put<Card>(`/api/skills/${this.card.id}`, {})
			.pipe(
				take(1),
				finalize(() => {
					this._isLoadingLike = false;
				}),
			)
			.subscribe({
				next: (card) => {
					this.card.likes = card.likes;
					this._occursSomeErrorOnLike = false;
					this.onSuccessLike();
				},
				error: () => {
					this._occursSomeErrorOnLike = true;
				},
			});
	}

	onSuccessLike() {
		this._confetti.addConfetti({
			confettiColors: [
				"#ff0a54",
				"#ff477e",
				"#ff7096",
				"#ff85a1",
				"#fbb1bd",
				"#f9bec7",
			],
		});
	}

	onShare() {
		window.open(
			"https://www.linkedin.com/in/dami%C3%A3o-fran%C3%A7a-a47b20223/",
			"_blank",
		);
	}
}
