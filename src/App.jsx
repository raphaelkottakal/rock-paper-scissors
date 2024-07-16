import { useEffect, useState } from "react";
import GameScreen from "./GameScreen";
import { insertCoin } from "playroomkit";
import "./App.css";

function App() {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const init = async () => {
			await insertCoin({
				gameId: import.meta.env.VITE_PLAYROOM_GAME_ID,
				maxPlayersPerRoom: 2,
				// skipLobby: true,
				matchmaking: true,
			});
			setReady(true);
		};
		init();
	}, []);
	return (
		<>{ready ? <GameScreen /> : <div id="loading-text">Loading...</div>}</>
	);
}

export default App;
