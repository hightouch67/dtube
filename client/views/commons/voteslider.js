Template.voteslider.rendered = function () {
    var slider = document.getElementById("voterange" + this.data.voteType);
    var bubble = document.getElementById("sliderBubble" + this.data.voteType)
    var value = document.getElementById("votevt" + this.data.voteType);
    var vt = parseFloat(Users.findOne({ username: Session.get('activeUsername'), network: 'avalon' }).vt.v / 100 * 50).toFixed(2)
    value.innerHTML = cuteNumber(vt)
    function setBubble() {
        const
            newValue = Number((slider.value - slider.min) * 100 / (slider.max - slider.min)),
            newPosition = 32 - (newValue * 0.64);
        bubble.innerHTML = `<span>${slider.value}%</span>`;
        bubble.style.left = `calc(${newValue}% + (${newPosition}px))`;
    }
    function cuteNumber(num, digits) {
        if (num > 1) num = Math.round(num)
        if (typeof digits === 'undefined') digits = 2
        var units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
        var decimal
        var newNum = num
        for (var i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1)
            if (num <= -decimal || num >= decimal) {
                newNum = +(num / decimal).toFixed(digits) + units[i]
                break
            }
        }
        var limit = (newNum < 0 ? 5 : 4)
        if (newNum.toString().length > limit && digits > 0)
            return cuteNumber(num, digits - 1)
        return newNum;
    }
    setBubble()
    slider.oninput = function () {
        var vt = parseFloat(Users.findOne({ username: Session.get('activeUsername'), network: 'avalon' }).vt.v / 100 * this.value).toFixed(2)
        value.innerHTML = cuteNumber(vt)
        setBubble()
    }
    $(`.${this.data.voteType}.button.voteslider`)
        .popup({
            popup: $(`.${this.data.voteType}vote.popup`),
            on: 'click',
            position: 'top center',

        })
    $('.ui.menu.voteslider .item').on('click', function () {
        $('.ui.menu.voteslider .item').removeClass('active');
        $(this).addClass('active');
        slider.value = this.dataset.value;
        value.innerHTML = cuteNumber(parseFloat(Users.findOne({ username: Session.get('activeUsername'), network: 'avalon' }).vt.v / 100 * this.dataset.value).toFixed(2), 2)
        setBubble()
    });
}


Template.voteslider.events({

    'click .addtag': function (event) {
        $('.tagvote').removeClass('dsp-non');
        $('.simplevote').addClass('dsp-non');
    },
    'click .removetag': function (event) {
        $('.simplevote').removeClass('dsp-non');
        $('.tagvote').addClass('dsp-non');
    },

    'click .button.upvote': function (event) {
        let author = FlowRouter.getParam("author")
        let permlink = FlowRouter.getParam("permlink")
        let weight = document.getElementById("voterangeup").value * 100
        let weightSteem = UserSettings.get('voteWeightSteem') * 100
        let weightHive = UserSettings.get('voteWeightHive') * 100
        let refs = Session.get('currentRefs')
        $('.ui.popup').popup('hide all');
        $('.ui.up.votesliderloader').removeClass('dsp-non');
        $('.ui.votebutton.voteslider.up').addClass('dsp-non');

        broadcast.multi.vote(refs, weight, weightSteem, weightHive, '', function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err), translate('GLOBAL_ERROR_COULD_NOT_VOTE'))
            else {
                toastr.success(translate('GLOBAL_ERROR_VOTE_FOR', weight / 100 + '%', author + '/' + permlink))
                // var audio = new Audio('http://localhost:3000/DTube_files/sounds/coin-drop-1.mp3');
                // audio.play();
            }
            $('.ui.up.votesliderloader').addClass('dsp-non');
            $('.ui.votebutton.voteslider.up').removeClass('dsp-non');
            Template.video.loadState()
        });
    },
    'click .button.downvote': function (event) {
        let author = FlowRouter.getParam("author")
        let permlink = FlowRouter.getParam("permlink")
        let weight = document.getElementById("voterangedown").value * -100
        let weightSteem = UserSettings.get('voteWeightSteem') * -100
        let weightHive = UserSettings.get('voteWeightHive') * -100
        let refs = Session.get('currentRefs')
        $('.ui.popup').popup('hide all');
        $('.ui.down.votesliderloader').removeClass('dsp-non');
        $('.ui.votebutton.voteslider.down').addClass('dsp-non');
        broadcast.multi.vote(refs, weight, weightSteem, weightHive, '', function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err), translate('GLOBAL_ERROR_COULD_NOT_VOTE'))
            else {
                toastr.success(translate('GLOBAL_ERROR_DOWNVOTE_FOR', weight / 100 + '%', author + '/' + permlink))
                // var audio = new Audio('http://localhost:3000/DTube_files/sounds/coin-drop-1.mp3');
                // audio.play();
            }
            $('.ui.down.votesliderloader').addClass('dsp-non');
            $('.ui.votebutton.voteslider.down').removeClass('dsp-non');
            Template.video.loadState()
        });
    },
    
    'click .button.upvotetag': function (event) {
        var newTag = $('.tagvote.up .tagvalue').val()
        if (!newTag) return
        let author = FlowRouter.getParam("author")
        let permlink = FlowRouter.getParam("permlink")
        let weight = document.getElementById("voterangeup").value * 100
        let weightSteem = UserSettings.get('voteWeightSteem') * 100
        let weightHive = UserSettings.get('voteWeightHive') * 100
        let refs = Session.get('currentRefs')
        $('.ui.popup').popup('hide all');
        $('.ui.up.votesliderloader').removeClass('dsp-non');
        $('.ui.votebutton.voteslider.up').addClass('dsp-non');

        broadcast.multi.vote(refs, weight, weightSteem, weightHive, newTag, function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err), translate('GLOBAL_ERROR_COULD_NOT_VOTE'))
            else {
                toastr.success(translate('GLOBAL_ERROR_VOTE_FOR', weight / 100 + '%', author + '/' + permlink))
                // var audio = new Audio('http://localhost:3000/DTube_files/sounds/coin-drop-1.mp3');
                // audio.play();
            }
            $('.ui.up.votesliderloader').addClass('dsp-non');
            $('.ui.votebutton.voteslider.up').removeClass('dsp-non');
            Template.video.loadState()
        });
    },
    'click .button.downvotetag': function (event) {
        var newTag = $('.tagvote.down .tagvalue').val()
        if (!newTag) return
        let author = FlowRouter.getParam("author")
        let permlink = FlowRouter.getParam("permlink")
        let weight = document.getElementById("voterangedown").value * -100
        let weightSteem = UserSettings.get('voteWeightSteem') * -100
        let weightHive = UserSettings.get('voteWeightHive') * -100
        let refs = Session.get('currentRefs')
        $('.ui.popup').popup('hide all');
        $('.ui.down.votesliderloader').removeClass('dsp-non');
        $('.ui.votebutton.voteslider.down').addClass('dsp-non');
        broadcast.multi.vote(refs, weight, weightSteem, weightHive, newTag, function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err), translate('GLOBAL_ERROR_COULD_NOT_VOTE'))
            else {
                toastr.success(translate('GLOBAL_ERROR_DOWNVOTE_FOR', weight / 100 + '%', author + '/' + permlink))
                // var audio = new Audio('http://localhost:3000/DTube_files/sounds/coin-drop-1.mp3');
                // audio.play();
            }
            $('.ui.down.votesliderloader').addClass('dsp-non');
            $('.ui.votebutton.voteslider.down').removeClass('dsp-non');
            Template.video.loadState()
        });
    },
})

Template.voteslider.helpers({
    mainUser: function () {
        return Users.findOne({ username: Session.get('activeUsername'), network: 'avalon' })
    },
    convertTag: function (tag) {
        var tagWithoutDtube = tag.replace("dtube-", "")
        return tagWithoutDtube
      }
});