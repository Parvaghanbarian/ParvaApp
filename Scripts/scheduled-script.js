javascript
var gr = new GlideRecord('x_1617115_parvaapp_device_request');
gr.addQuery('u_choice_1', 'delivery failed');
gr.addQuery('u_glide_date_time_1', '');
gr.query();

var current = new GlideDateTime();
while (gr.next()) {
    gr.u_glide_date_time_1 = current;
    gr.update();
    gs.eventQueue('x_1617115_parvaapp.pickup', gr, gr.number);
}
