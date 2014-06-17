function equalizeColumns(container) {
    var eqColAr = new Array();
    // create array of element heights
    $(this).find(".eqHeight").each(function (index) {
        eqColAr.push({ i: index, height: $(this).height() });
    });

    // sort by height - tallest to shortest
    eqColAr.sort(function (a, b) {
        return b.height - a.height;
    });

    // find height difference
    var diffHeight = eqColAr[0].height - eqColAr[1].height;

    if (diffHeight) {
        // add margin to label in shorter column
        $(this).find(".eqHeight").eq(eqColAr[1].i).find("label").css("margin-top", diffHeight + "px");
    }
}