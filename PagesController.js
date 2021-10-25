/**
 * PagesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */




module.exports = {

    // action - create
    create: async function (req, res) {

        if (req.method == "GET") return res.view('createevent/createtext');

        var events = await Pages.create(req.body).fetch();

        return res.status(201).json({ id: events.id });
    },


    // action - jsjson function
    json: async function (req, res) {

        var allevents = await Pages.find();

        return res.json(allevents);
    },


    // action - list
    list: async function (req, res) {

        var allevents = await Pages.find();

        return res.view('createevent/list', { events: allevents });
    },

    //action - show
    show: async function (req, res) {


        var perPage = Math.max(req.query.perPage, 4) || 4;

        var allcurevent = await Pages.find();




        var highlighteventlist = [];

        for (let i = 0; i < allcurevent.length; i++) {
            if (allcurevent[i].highlight == "on") {
                highlighteventlist[i] = allcurevent[i];
            }
        }


        var someevents = await Pages.find({
            limit: perPage,
            skip: perPage * (Math.max(req.query.current - 1, 0) || 0)
        });

        var finalevents = [];
        var count = 0;

        for (let i = 0; i < highlighteventlist.length; i++) {
            if (allcurevent[i] == highlighteventlist[i]) {
                finalevents[i] = allcurevent[i];
                count++;
            }
            if (count == 4) {
                break;
            }
        }



        var count = await Pages.count();

        return res.view('createevent/firstpage', { events: finalevents, total: count });
    },






    // action - read
    read: async function (req, res) {

        var thatevent = await Pages.findOne(req.params.id);

        if (!thatevent) return res.notFound();

        return res.view('createevent/read', { events: thatevent });
    },

    // action - delete 
    delete: async function (req, res) {

        var deletedevent = await Pages.destroyOne(req.params.id);

        if (!deletedevent) return res.notFound();

        return res.ok("Event deleted.");
    },

    update: async function (req, res) {

        if (req.method == "GET") {

            var thatevent = await Pages.findOne(req.params.id);

            if (!thatevent) return res.notFound();

            return res.view('createevent/update', { events: thatevent });

        } else {

            var updatedevent = await Pages.updateOne(req.params.id).set(req.body);

            if (!updatedevent) return res.notFound();

            return res.ok("Record updated");
        }
    },

    // search function
    search: async function (req, res) {

        var whereClause = {};

        if (req.query.eventname) whereClause.eventname = { contains: req.query.eventname };

        if (req.query.origanizer) whereClause.origanizer = req.query.origanizer;

        if (req.query.venue) whereClause.venue = req.query.venue;

        var thoseevents = await Pages.find({
            where: whereClause,
            sort: 'eventname'
        });

        var starting = new Date(req.query.startdate);
        var ending = new Date(req.query.enddate);

        let finalevents = [];

        for (let i = 0; i < thoseevents.length; i++) {

            var wantlong = new Date(thoseevents[i].eventdate);
            if (wantlong > starting && ending > wantlong) {

                finalevents[i] = thoseevents[i];
            }
        }

        return res.view('createevent/list', { events: finalevents });
    },

    // action - paginate
    paginate: async function (req, res) {

        var perPage = Math.max(req.query.perPage, 2) || 2;

        var someevents = await Pages.find({
            limit: perPage,
            skip: perPage * (Math.max(req.query.current - 1, 0) || 0)
        });

        var count = await Pages.count();

        return res.view('createevent/paginate', { events: someevents, total: count });
    },




};

