from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.response_offer import ResponseOffer
from models.incident_report import IncidentReport

offer_bp = Blueprint('offer', __name__)

@offer_bp.route('/offers', methods=['POST'])
@jwt_required()
def create_offer():
    data = request.get_json()
    message = data.get('message')
    incident_id = data.get('incident_id')
    user_id = get_jwt_identity()

    if not message or not incident_id:
        return jsonify({"error": "Message and incident_id are required"}), 400

    # Check if the incident exists
    incident = IncidentReport.query.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    new_offer = ResponseOffer(
        message=message,
        user_id=user_id,
        incident_id=incident_id
    )

    db.session.add(new_offer)
    db.session.commit()

    return jsonify({
        "message": "Offer submitted successfully",
        "id": new_offer.id,
        "incident_id": incident_id,
        "user_id": user_id
    }), 201


@offer_bp.route('/offers', methods=['GET'])
def get_all_offers():
    offers = ResponseOffer.query.all()

    results = []
    for offer in offers:
        results.append({
            "id": offer.id,
            "message": offer.message,
            "incident_id": offer.incident_id,
            "user_id": offer.user_id
        })

    return jsonify(results), 200
