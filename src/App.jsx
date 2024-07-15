import { useEffect, useState } from "react";
import GameScreen from "./GameScreen";
import { insertCoin } from "playroomkit";

function App() {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const init = async () => {
			await insertCoin({
				gameId: import.meta.env.VITE_PLAYROOM_GAME_ID,
				maxPlayersPerRoom: 2,
				matchmaking: true,
				// skipLobby: true,
			});
			setReady(true);
		};
		init();
	}, []);
	return <>{ready ? <GameScreen /> : "Loading..."}</>;
}

export default App;
