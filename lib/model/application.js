'use strict';
module.exports = function(app){

    var Schema = app.mongoose.Schema;

    var fields = {
        _id: { type: Schema.Types.ObjectId },
    
        
            namespace:{ type:String },
        
    
        
            name:{ type:String },
        
    
        
            desc_raw:String,
            desc_rendered:String,
        
    
        
            url:{ type:String },
        
    
        
            owner:{ type: Schema.Types.ObjectId, ref: 'Account' },
        
    
        cre_date:Date
    };

    var applicationSchema = new Schema(fields);

    applicationSchema.virtual('uri').get(function(){
        
            return '/applications/' + this.namespace;
        
    });

    
        
    
        
    
        
            applicationSchema.virtual('desc').get(function(){
                return this.desc_rendered;
            }).set(function(value){
                var markdown = require('markdown').markdown;
                this.desc_raw = value;
                this.desc_rendered = markdown.toHTML(value);
            });

        
    
        
    
        
    


    applicationSchema.pre('save', function(next){
        if(!this._id){
            this._id = new app.mongoose.Types.ObjectId();
        }
        return next();
    });

    if (!applicationSchema.options.toObject) applicationSchema.options.toObject = {};
    applicationSchema.options.toObject.transform = function (doc, ret, options) {
        ret.uri = doc.uri;
        
            

            
        
            

            
        
            
                ret.desc = doc.desc_rendered;
                ret.desc_raw = doc.desc_raw;
            
        
            

            
        
            

            
        
    }

    return app.mongoose.model('Application', applicationSchema);
}