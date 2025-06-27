from flask_cors import CORS  
from flask import Flask
from extensions import db, migrate, jwt
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Enable CORS here
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import models to register them with SQLAlchemy
    import models

    # Register blueprints
    from controllers.auth_controller import auth_bp
    from controllers.incident_controller import incident_bp
    from controllers.offer_controller import offer_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(incident_bp)
    app.register_blueprint(offer_bp)

    # Health check route
    @app.route('/')
    def home():
        return {'message': 'DisasterLink API is running!'}

    return app
