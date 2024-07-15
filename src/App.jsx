import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
	insertCoin,
	isHost,
	myPlayer,
	usePlayerState,
	usePlayersList,
	useMultiplayerState,
	usePlayersState,
	resetPlayersStates,
} from "playroomkit";

await insertCoin({
	gameId: import.meta.env.VITE_PLAYROOM_GAME_ID,
	maxPlayersPerRoom: 2,
});

const choiceIndexMap = ["Rock", "Paper", "Scissors"];

function App() {
	const thisPlayer = myPlayer();
	const [myChoice, setMyChoice] = usePlayerState(thisPlayer, "choice", null);
	const [games, setGames] = useMultiplayerState("games", []);
	const playerChoices = usePlayersState("choice");

	// console.log(games);

	const endGame = () => {
		// console.log("Check winner");
		const playerOne = playerChoices[0].state;
		const playerTwo = playerChoices[1].state;
		// console.log("playerOne", playerOne);
		// console.log("playerTwo", playerTwo);

		if (playerOne === playerTwo) {
			// console.log("Tie");
			setGames([...games, { winnerId: null, playerChoices }]);
		} else if (playerOne === 0) {
			if (playerTwo === 1) {
				// console.log("playerTwo wins");
				setGames([
					...games,
					{ winnerId: playerChoices[1].player.id, playerChoices },
				]);
			} else {
				// console.log("playerOne wins");
				setGames([
					...games,
					{ winnerId: playerChoices[0].player.id, playerChoices },
				]);
			}
		} else if (playerOne === 2) {
			if (playerTwo === 0) {
				// console.log("playerTwo wins");
				setGames([
					...games,
					{ winnerId: playerChoices[1].player.id, playerChoices },
				]);
			} else {
				// console.log("playerOne wins");
				setGames([
					...games,
					{ winnerId: playerChoices[0].player.id, playerChoices },
				]);
			}
		} else if (playerOne === 1) {
			if (playerTwo === 2) {
				// console.log("playerTwo wins");
				setGames([
					...games,
					{ winnerId: playerChoices[1].player.id, playerChoices },
				]);
			} else {
				// console.log("playerOne wins");
				setGames([
					...games,
					{ winnerId: playerChoices[0].player.id, playerChoices },
				]);
			}
		}

		// setGames([...games, { winnerId: thisPlayer.id, playerChoices }]);
		resetPlayersStates();
	};

	useEffect(() => {
		let bothPlayersReady = true;
		playerChoices.forEach((playerState) => {
			if (playerState.state === null || playerState.state === undefined) {
				bothPlayersReady = false;
			}
		});
		if (bothPlayersReady && isHost()) endGame();
	}, [playerChoices]);

	if (playerChoices.length !== 2) {
		return (
			<>
				<h1>Rock Paper Scissors</h1>
				<h2>Waiting for other player</h2>
			</>
		);
	}

	return (
		<>
			<h1>Rock Paper Scissors</h1>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{choiceIndexMap.map((choice, i) => (
					<button
						style={{
							backgroundColor: i === myChoice ? "green" : "#1a1a1a",
						}}
						key={i}
						onClick={() => setMyChoice(i)}
					>
						{choice}
					</button>
				))}
			</div>

			{playerChoices.map((playerState, i) => {
				// console.log(thisPlayer.id === player.id);
				const isCurrentPlayer = thisPlayer.id === playerState.player.id;
				const playerName = playerState.player.getProfile().name;
				return (
					<div
						key={i}
						style={{
							display: isCurrentPlayer ? "none" : "block",
						}}
					>
						<div
							style={{
								display: playerState.state === null ? "block" : "none",
								color: "red",
							}}
						>
							{playerName} is still making a choice
						</div>
						<div
							style={{
								display: playerState.state === null ? "none" : "block",
								color: "green",
							}}
						>
							{playerName} has made a choice
						</div>
					</div>
				);
			})}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{games.map((game, i) => {
					return (
						<div
							key={i}
							style={{
								width: 16,
								height: 16,
								borderRadius: "50%",
								margin: 8,
								backgroundColor:
									game.winnerId !== null
										? game.winnerId === thisPlayer.id
											? "green"
											: "red"
										: "gray",
							}}
						></div>
					);
				})}
			</div>
		</>
	);
}

export default App;
