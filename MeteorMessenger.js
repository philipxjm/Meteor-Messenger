Messages = new Meteor.Collection("messages");

if (Meteor.isClient) {
    Meteor.subscribe("messages");

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

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
        $('body').tooltip({
            selector: '.message-bubble'
        });
    }

    Template.messages.helpers({
        messages: function() {
            try {
                return Messages.find({
                    $or: [{
                        user: Meteor.user().username,
                        chat_target: Session.get("chat_target")
                    }, {
                        user: Session.get("chat_target"),
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
        },
        tooltip_placement: function() {
            return this.user == Meteor.user().username ? 'left' : 'right';
        }
    });

    Template.friendlist.helpers({
        'friends': function() {
            return Meteor.users.find({
                username: {
                    $ne: Meteor.user().username
                }
            }, {
                sort: {
                    username: 1
                }
            });
        },
        'gravatarurl': function() {
            var url = Gravatar.imageUrl(this.username + '@example.com', {
                size: 49,
                default: 'identicon'
            });
            return url;
        },
        'selected': function() {
            return Session.get("chat_target") == this.username ? 'selected' : '';
        }
    });

    Template.friendlist.events({
        'click .selectuser': function() {
            Session.set("chat_target", this.username);
            console.log(this.username)
        }
    })

    Template.informationbar.helpers({
        'gravatarurl': function() {
            if (!Session.get("chat_target")) {
                return Gravatar.imageUrl('hi@example.com', {
                    size: 49,
                    default: 'blank'
                });;
            }
            var url = Gravatar.imageUrl(Session.get("chat_target") + '@example.com', {
                size: 49,
                default: 'identicon'
            });
            return url;
        },
        'chat_target': function() {
            return Session.get("chat_target");
        }
    });

    Template.over.helpers({
        'overlay_class': function() {
            return Meteor.user() ? 'hidden' : '';
        }
    });

    console.log(Session.get("chat_target"));
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        Meteor.publish("userStatus", function() {
            return Meteor.users.find({
                "status.online": true
            }, {});
        });
    });
}
