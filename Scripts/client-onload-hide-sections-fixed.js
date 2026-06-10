if (g_form.isNewRecord()) {
    g_form.setSectionDisplay('device_details', false);
    g_form.setSectionDisplay('delivery_details', false);
} else {
    if (g_form.getValue('device_name')) {
        g_form.setSectionDisplay('device_details', true);
        g_form.setSectionDisplay('delivery_details', true);
    }
}
