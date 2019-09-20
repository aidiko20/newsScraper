$(function () {
    $(".scrape-reviews").on("click", function (event) {
        event.preventDefault();
        $("#scraping-articles-modal").modal("show");
        $.ajax({
            url: "/scrape",
            type: "GET",
            success: function (result) {
                $("#scraping-articles-modal").modal("hide");
                $(".modal-body").text(result.message);
                $("#articles-scraped-modal").modal("show");
            },
            error: function () {
                $("#scraping-articles-modal").modal("hide");
                $(".modal-body").text("Could not scrape at this time");
                $("#articles-scraped-modal").modal("show");
            }
        });
    });

    $("#articles-scraped-modal").on("hidden.bs.modal", function () {
        location.reload();
    });

    $(".comments-modal").on("hidden.bs.modal", function () {
        location.reload();
    });

    $(".save-article").on("click", function (event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id")
        $.ajax({
            url: "article/" + articleId,
            type: "PUT",
            data: { saved: true }
        }).then(function () {
            location.reload();
        });
    });

    $(".unsave-article").on("click", function (event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id")
        $.ajax({
            url: "article/" + articleId,
            type: "PUT",
            data: { saved: false }
        }).then(function () {
            location.reload();
        });
    });

    $(".add-note").on("click", function (event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id");
        $("#notes-modal-" + articleId).modal("show");
    })

    $(".submit-note").on("click", function (event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id");
        let name = $("#name-input-" + articleId).val();
        let body = $("#note-area-" + articleId).val()
        if (name && body) {
            $.ajax({
                url: "/article/" + articleId,
                type: "POST",
                data: {
                    name: name,
                    body: body
                }
            }).then(function () {
                $("#notes-modal-" + articleId).modal("hide");
            })
        }
        else {
            console.log("Needs all fields filled out");
        }
    })

    $(".delete-note").on("click", function (event) {
        event.preventDefault();
        let noteId = $(this).attr("data-id");
        let articleId = $(this).parent().attr("data-id");
        $.ajax({
            url: "/article/" + articleId + "/note/" + noteId,
            type: "DELETE"
        }).then(function () {
            $("#notes-modal-" + articleId).modal("hide");
        })
    })

});