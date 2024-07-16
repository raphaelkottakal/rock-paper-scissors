import { useEffect, useRef, useState } from "react";
import "./GameScreen.css";
import {
	isHost,
	myPlayer,
	usePlayerState,
	useMultiplayerState,
	usePlayersState,
	resetPlayersStates,
	usePlayersList,
} from "playroomkit";
import { gsap } from "gsap/dist/gsap";

const choiceIndexMap = ["Rock", "Paper", "Scissors"];

function GameScreen() {
	const thisPlayer = myPlayer();
	const playerList = usePlayersList();
	const [otherPlayer, setOtherPlayer] = useState(null);
	const [myChoice, setMyChoice] = usePlayerState(thisPlayer, "choice", null);
	const playersChoices = usePlayersState("choice");
	const [games, setGames] = useMultiplayerState("games", []);
	const [isLocked, setIsLocked] = useState(false);
	const [roundWinnerId, setRoundWinnerId] = useState(null);
	const resultPopupRef = useRef();

	const othersChoice = playersChoices.find(
		(state) => state?.player?.id === otherPlayer?.id
	)?.state;

	const hasOthersMadeChoice =
		othersChoice === 0 || othersChoice === 1 || othersChoice === 2;

	// console.log(playersChoices);
	// console.log(othersChoice);
	// console.log(games);

	useEffect(() => {
		setOtherPlayer(playerList.find((player) => player.id !== thisPlayer.id));
	}, [playerList]);

	useEffect(() => {
		if (playersChoices.length === 1) return;
		let bothPlayersReady = true;
		playersChoices.forEach((playerState) => {
			if (playerState.state === null || playerState.state === undefined) {
				bothPlayersReady = false;
			}
		});
		if (bothPlayersReady) {
			setIsLocked(true);
			setTimeout(() => {
				endGame();
			}, 500);
			const onFirstFadeComplete = () => {
				gsap.to(resultPopupRef.current, {
					opacity: 0,
					duration: 0.25,
					delay: 1,
					onComplete: () => {
						setIsLocked(false);
					},
				});
			};
			gsap.to(resultPopupRef.current, {
				opacity: 1,
				delay: 0.5,
				duration: 0.25,
				onComplete: onFirstFadeComplete,
			});
		}
	}, [playersChoices]);

	const handleRoundWinner = (winnerId) => {
		setRoundWinnerId(winnerId);
		if (isHost()) {
			setGames([
				...games,
				{
					winnerId: winnerId,
					playersChoices: playersChoices.map((choice) => {
						return { playerId: choice.player.id, state: choice.state };
					}),
				},
			]);
		}
	};

	const endGame = () => {
		const playerOne = playersChoices[0]?.state;
		const playerTwo = playersChoices[1]?.state;

		if (playerOne === playerTwo) {
			handleRoundWinner(null);
		} else if (playerOne === 0) {
			if (playerTwo === 1) {
				handleRoundWinner(playersChoices[1].player.id);
			} else {
				handleRoundWinner(playersChoices[0].player.id);
			}
		} else if (playerOne === 2) {
			if (playerTwo === 0) {
				handleRoundWinner(playersChoices[1].player.id);
			} else {
				handleRoundWinner(playersChoices[0].player.id);
			}
		} else if (playerOne === 1) {
			if (playerTwo === 2) {
				handleRoundWinner(playersChoices[1].player.id);
			} else {
				handleRoundWinner(playersChoices[0].player.id);
			}
		}

		if (isHost()) {
			resetPlayersStates();
		}
	};

	const handleChoiceClick = (index) => {
		setMyChoice(index, true);
	};

	const roundWinnerText =
		roundWinnerId === null
			? "It's a Tie"
			: roundWinnerId === thisPlayer.id
			? "You Won!"
			: "You lost...";

	return (
		<>
			<div id="main-container">
				<div id="other-player-container">
					{otherPlayer ? (
						<div>
							<div className="medium-text">
								{otherPlayer.getProfile().name} is connected
							</div>
							<div
								id="other-player-choice"
								style={{
									backgroundColor: hasOthersMadeChoice ? "green" : "#1a1a1a",
								}}
							>
								{hasOthersMadeChoice ? "Choice Made" : "No Choice made"}
							</div>
						</div>
					) : (
						<div className="medium-text">Waiting for another player</div>
					)}
				</div>
				<div id="this-player-container">
					<div className="medium-text">
						{otherPlayer ? "Make your choice" : "Waiting for another player"}
					</div>
					<div id="this-player-choice-container">
						{choiceIndexMap.map((choice, i) => (
							<button
								disabled={playerList.length === 1 || isLocked}
								style={{
									backgroundColor: i === myChoice ? "green" : "#1a1a1a",
								}}
								key={i}
								onClick={() => handleChoiceClick(i)}
							>
								{choice}
							</button>
						))}
					</div>
				</div>
			</div>

			<div id="status-container">
				<div>Rock Paper Scissors</div>
				<div id="games-container">
					{games.map((game, i) => {
						return (
							<div
								key={i}
								className="game-dot"
								style={{
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
			</div>

			<div ref={resultPopupRef} id="result-popup">
				{games.length !== 0 && roundWinnerText}
			</div>
		</>
	);
}

export default GameScreen;
