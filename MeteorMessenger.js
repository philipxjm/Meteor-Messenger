Messages = new Meteor.Collection("messages");

if (Meteor.isClient) {
    Meteor.subscribe("messages");

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    //temp chat-target set
    Session.set("chat_target", "Dovahkiin");

    Template.input.events({
        'click .sendMsg': function(e) {
            sendMessage();
        },
        'keyup #msg': function(e) {
            if (e.type == "keyup" && e.which == 13) {
                sendMessage();
            };
        }
    });

    function sendMessage() {
        var message = document.getElementById("msg");
        Messages.insert({
            user: Meteor.user().username,
            chat_target: Session.get("chat_target"),
            msg: message.value,
            ts: new Date()
        });
        message.value = "";
        message.focus();
    }

    Template.messages.helpers({
        messages: function() {
            return Messages.find({
                user: Meteor.user().username,
                chat_target: Session.get("chat_target")
            }, {
                sort: {
                    ts: -1
                }
            });
        }
    });

    Template.message.helpers({
        timestamp: function() {
            return this.ts.toLocaleString();
        }
    });

    console.log(Session.get("chat_target"));
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        Messages.remove({});
    });
}
