import { RouteObject } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import App from './App'
import DCA from './DCA/DCA'
import Error from './Error/Error'
import Portfolio from './Portfolio/Portfolio'
import PortfolioCreate from './Portfolio/PortfolioCreate'
import Tests from './Tests/Tests'
import PortfolioAddToken from './Portfolio/Token/PortfolioAddToken'
import PortfolioEditToken from './Portfolio/Token/PortfolioEditToken'
import PortfolioEdit from './Portfolio/PortfolioEdit'
import PortfolioShow from './Portfolio/PortfolioShow'
import Bots from './Bots/Bots'
import Connexion from './Connexion/Connexion'
import Inscription from './Inscription/Inscription'
import Account from './Account/Account'
import PortfolioAddWallet from './Portfolio/Wallet/PortfolioAddWallet'
import PortfolioViewToken from './Portfolio/Token/PortfolioViewToken'
import PortfolioAddExchange from './Portfolio/Exchange/PortfolioAddExchange'

const routes: RouteObject[] = [
	{
		path: '/',
		element: <App />,
		errorElement: <Error />,
		children: [
			{
				errorElement: <Error />,
				children: [
					{ element: <Dashboard />, index: true },
					{ element: <DCA />, path: 'dca' },
					{ element: <Bots />, path: 'bots' },
					{ element: <Portfolio />, path: 'portfolio' },
					{ element: <PortfolioCreate />, path: 'portfolio/create' },
					{ element: <PortfolioAddToken />, path: 'portfolio/add-token' },
					{ element: <PortfolioEditToken />, path: 'portfolio/edit-token' },
					{ element: <PortfolioViewToken />, path: 'portfolio/view-token' },
					{ element: <PortfolioAddWallet />, path: 'portfolio/add-wallet' },
					{ element: <PortfolioAddExchange />, path: 'portfolio/add-exchange' },
					{ element: <Tests />, path: 'tests' },
					{ element: <PortfolioEdit />, path: 'portfolio/edit' },
					{ element: <PortfolioShow />, path: 'portfolio/show' },
					{ element: <Connexion />, path: 'login' },
					{ element: <Inscription />, path: 'inscription' },
					{ element: <Account />, path: 'account' },
				],
			},
		],
	},
]

export { routes }
