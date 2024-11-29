from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    name = fields.String(required=False)
    email = fields.Email(required=True)
    password = fields.String(required=False, validate=validate.Length(min=6))
    picture = fields.String(required=False,default="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png")

    class Meta:
        unknown = "exclude"