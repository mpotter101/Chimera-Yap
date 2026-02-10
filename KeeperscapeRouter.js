import path from 'path';
import KeeperscapeTemplater from './KeeperscapeTemplater.js';

export default class KeeperscapeRouter {
	constructor ({directory, app}) {
		this.directory = directory;
		this.AddRoutesToApp (app);
	}
	
	GetNavbarFile (req) {
		var hasUser = false // req.session.user && Object.keys (req.session.user).length;
		return hasUser ? 'logged-in-navbar.html' : 'logged-out-navbar.html';
	}
	
	GetUserFromSession(req) {
		var user = {}

		if (req.session && req.session.user && Object.keys (req.session.user).length)
		{
			user = req.session.user;
		}

		return user;
	}

	async SendPage({req, res, page, tabTitle}) {
		var user = this.GetUserFromSession(req)

		var content = await KeeperscapeTemplater.CompilePage ({
			user: user,
			page,
			templateFilePath: path.join (this.directory, '/Html/Partial/template.html'),
			navbarFilePath: path.join (this.directory, '/Html/Partial/' + this.GetNavbarFile (req)), 
			footerFilePath: path.join (this.directory, '/Html/Partial/footer-bar.html'),
			tabTitle
		});
		//console.log (res)
		res.send(content);
	}

	async SendMainPage (req, res) {
		var page = await KeeperscapeTemplater.GetPage (path.join (this.directory, '/Html/Main.html'));
		page = KeeperscapeTemplater.GetFilledOutPage ({ 
				data: {}, // to send data, use this format: '{{USERNAME}}': user.username 
				page
			});
		await this.SendPage ({req: req, res: res, page: page, tabTitle: 'Chimera Yap'});
		return;
	}
	
	AddRoutesToApp (app) {
		app.route ('/').get ( 
			(req, res) => {
				this.SendMainPage (req, res); 
			}
		);
	}
}