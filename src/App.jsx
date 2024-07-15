import { useEffect, useState } from "react";
import "./App.css";
import {
	insertCoin,
	isHost,
	myPlayer,
	usePlayerState,
	useMultiplayerState,
	usePlayersState,
	resetPlayersStates,
} from "playroomkit";

await insertCoin({
	gameId: import.meta.env.VITE_PLAYROOM_GAME_ID,
	maxPlayersPerRoom: 2,
	matchmaking: true,
	// skipLobby: true,
});

const choiceIndexMap = ["Rock", "Paper", "Scissors"];

function App() {
	const thisPlayer = myPlayer();
	const [isLocked, setIsLocked] = useState(false);
	const [myChoice, setMyChoice] = usePlayerState(thisPlayer, "choice", null);
	const [games, setGames] = useMultiplayerState("games", []);
	const playerChoices = usePlayersState("choice");

	// console.log("allPlayer", allPlayer);
	// console.log("games", games);
	// console.log("playerChoices", playerChoices);
	// console.log("thisPlayer", thisPlayer);

	const endGame = () => {
		if (isHost()) {
			// console.log("Check winner");
			const playerOne = playerChoices[0]?.state;
			const playerTwo = playerChoices[1]?.state;
			// console.log("playerOne", playerOne);
			// console.log("playerTwo", playerTwo);

			if (playerOne === playerTwo) {
				// console.log("Tie");
				setGames([...games, { winnerId: null }]);
			} else if (playerOne === 0) {
				if (playerTwo === 1) {
					// console.log("playerTwo wins");
					setGames([...games, { winnerId: playerChoices[1].player.id }]);
				} else {
					// console.log("playerOne wins");
					setGames([...games, { winnerId: playerChoices[0].player.id }]);
				}
			} else if (playerOne === 2) {
				if (playerTwo === 0) {
					// console.log("playerTwo wins");
					setGames([...games, { winnerId: playerChoices[1].player.id }]);
				} else {
					// console.log("playerOne wins");
					setGames([...games, { winnerId: playerChoices[0].player.id }]);
				}
			} else if (playerOne === 1) {
				if (playerTwo === 2) {
					// console.log("playerTwo wins");
					setGames([...games, { winnerId: playerChoices[1].player.id }]);
				} else {
					// console.log("playerOne wins");
					setGames([...games, { winnerId: playerChoices[0].player.id }]);
				}
			}
			resetPlayersStates();
		}
		setIsLocked(false);
	};

	useEffect(() => {
		let bothPlayersReady = true;
		playerChoices.forEach((playerState) => {
			if (playerState.state === null || playerState.state === undefined) {
				bothPlayersReady = false;
			}
		});
		if (bothPlayersReady) {
			setIsLocked(true);
			setTimeout(() => {
				endGame();
			}, 1000);
		}
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
						disabled={isLocked}
						style={{
							backgroundColor: i === myChoice ? "green" : "#1a1a1a",
						}}
						key={i}
						onClick={() => setMyChoice(i, true)}
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
							{/* Other Player is still making a choice */}
						</div>
						<div
							style={{
								display: playerState.state === null ? "none" : "block",
								color: "green",
							}}
						>
							{playerName} has made a choice
							{/* Other Player has made a choice */}
						</div>
					</div>
				);
			})}
			<div>Round {games.length + 1}</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexWrap: "wrap",
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
