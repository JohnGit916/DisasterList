from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.incident_report import IncidentReport
from models.user import User
from models.response_offer import ResponseOffer  # 👈 needed for fetching offers

incident_bp = Blueprint('incident', __name__)

# 🔐 POST /incidents - Create a new incident report (Requires auth)
@incident_bp.route('/incidents', methods=['POST'])
@jwt_required()
def create_incident():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    location = data.get('location')

    if not title or not description or not location:
        return jsonify({'error': 'All fields are required'}), 400

    user_id = get_jwt_identity()

    new_incident = IncidentReport(
        title=title,
        description=description,
        location=location,
        user_id=user_id
    )

    db.session.add(new_incident)
    db.session.commit()

    return jsonify({
        'message': 'Incident reported successfully',
        'id': new_incident.id,
        'title': new_incident.title,
        'location': new_incident.location,
        'user_id': user_id
    }), 201

# 🌍 GET /incidents - Public route to fetch all incidents
@incident_bp.route('/incidents', methods=['GET'])
def get_all_incidents():
    incidents = IncidentReport.query.all()

    result = []
    for incident in incidents:
        result.append({
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "location": incident.location,
            "user_id": incident.user_id
        })

    return jsonify(result), 200

# 📄 GET /incidents/<id> - Single incident
@incident_bp.route('/incidents/<int:id>', methods=['GET'])
def get_incident(id):
    incident = IncidentReport.query.get(id)

    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    return jsonify({
        "id": incident.id,
        "title": incident.title,
        "description": incident.description,
        "location": incident.location,
        "user_id": incident.user_id
    }), 200

# ❌ DELETE /incidents/<id> - Delete if owner
@incident_bp.route('/incidents/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_incident(id):
    user_id = get_jwt_identity()
    incident = IncidentReport.query.get(id)

    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    if str(incident.user_id) != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(incident)
    db.session.commit()

    return jsonify({"message": "Incident deleted successfully"}), 200

# 📦 GET /incidents/<id>/offers - Get offers linked to a specific incident
@incident_bp.route('/incidents/<int:id>/offers', methods=['GET'])
def get_offers_for_incident(id):
    incident = IncidentReport.query.get(id)

    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    offers = ResponseOffer.query.filter_by(incident_id=id).all()

    result = []
    for offer in offers:
        result.append({
            "id": offer.id,
            "message": offer.message,
            "user_id": offer.user_id
        })

    return jsonify(result), 200
