var quantity = g_form.getValue('choose_quantity');
if (isNaN(quantity)) {
    alert('You must put a number in this field!');
} else {
    if (quantity > 3) {
        g_form.setMandatory('business_justification', true);
    } else {
        g_form.setMandatory('business_justification', false);
    }
}
