const router = require("express").Router();
const passport = require("passport");

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/login/failed",
    }),
    (req, res) => {
        res.redirect(process.env.CLIENT_URL);
    }
);

router.get("/logout", (req, res) => {
    req.logout(() => {
		console.log('log out2 ----------------------')
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;