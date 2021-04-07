"""Definition of views for logging in and out."""
from flask import Blueprint, render_template, request, abort
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

login_bp = Blueprint(
    "login",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/gens/static",
)

class User:
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'foo', 'bar'),
    User(2, 'markjo', 'test'),
]
username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.endcode('utf-8'), password.encode('utf-8')):
        return user

class LoginForm(FlaskForm):
    username = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

@login_bp.route("/login", methods=["GET", "POST"])
def login():
    """Login."""
    form = LoginForm()

    if request.method == "POST" and form.validate():
        authorize(form)

    return render_template('login.html', form=form)

@login_bp.route("/logout", methods=["GET"])
def logout():
    """Logout."""
    pass
