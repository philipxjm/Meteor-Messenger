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
        var messagebox = document.getElementById("msg");
        if (messagebox.value) {
            Messages.insert({
                user: Meteor.user().username,
                chat_target: Session.get("chat_target"),
                msg: messagebox.value,
                ts: new Date()
            });
            messagebox.value = "";
        };
        messagebox.focus();
    }

    Template.messages.rendered = function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('body').tooltop({selector: '.message-bubble'});
    }

    Template.messages.helpers({
        messages: function() {
            try {
                return Messages.find({
                    $or: [{
                        user: Meteor.user().username
                    }, {
                        chat_target: Meteor.user().username
                    }]
                }, {
                    sort: {
                        ts: -1
                    }
                });
            } catch (err) {
                // ignore
            }
        },
        timestamp: function() {
            return this.ts.toLocaleString();
        },
        messageFromToBubbleClass: function() {
            return this.user == Meteor.user().username ? 'to-bubble' : 'from-bubble';
        },
        messageFromToBlockClass: function() {
            return this.user == Meteor.user().username ? 'message-block-to' : 'message-block-from';
        }
    });

    console.log(Session.get("chat_target"));
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        Messages.remove({});
    });
}
