g_form.getReference('device_name', function(deviceRecord) {
    g_form.setValue('model_name', deviceRecord.u_model_name);
    g_form.setValue('price', deviceRecord.u_price);
    g_form.setValue('warranty', deviceRecord.u_warranty);
    g_form.setValue('expiration', deviceRecord.u_expiration);
});
