g_form.getReference('choose_your_ai_device', function(checkPrice) {
    var price = checkPrice.u_price_2;
    g_form.setValue('total_amount', price * parseInt(newValue));
});
