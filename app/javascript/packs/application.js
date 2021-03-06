// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()

import 'expose-loader?$!jquery';
import 'bootstrap';
import '../stylesheets/application';

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

$(document).on('turbolinks:load', function() {
    $('.dropdown-toggle').keypress(function() {
        $('.dropdown-menu').dropdown('show')
        $('.dropdown-menu').dropdown('update')
    })

    $('.update-defaults').change(function() {
        let url = $(this).data('defaultsUrl')
        let theater = $('#flight_theater').val()
        let callsign = $('#flight_callsign').val()
        let callsign_number = $('#flight_callsign_number').val()
        $.get(url + '?' + $.param({ t: theater, cs: callsign, n: callsign_number}), function(data) {
            $('#flight_frequency').val(data['freq'])
            $('#flight_group_id').val(data['group'])
            $('#flight_laser').val(data['laser'])
            $('#flight_tacan_channel').val(data['tcn'])
            $('#flight_tacan_polarization').val('Y')
        })
    })

    $('#waypointdlg').on('shown.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        $('#waypoint_id').val(button.data('id'))
        $('#waypoint_name').val(button.data('name'))
        $('#waypoint_position').val(button.data('pos'))
        $('#waypoint_altitude').val(button.data('alt'))
        $('#waypoint_tot').val(button.data('tot'))

        $('#waypoint_name').focus()
    })

    $('#waypointform').submit(function(event) {
        $.post(window.location.href + '/waypoints/' + $('#waypoint_id').val(), {
            name: $('#waypoint_name').val(),
            position: $('#waypoint_position').val(),
            altitude: $('#waypoint_altitude').val(),
            tot: $('#waypoint_tot').val()
        }, function(data) {
            let id = $('#waypoint_id').val()
            if (id === '') {
                $('#add-waypoint').before(data)
            } else {
                $('#waypoint_' + id).replaceWith(data)
            }

            $('#waypoint_id').val('')
            $('#waypoint_name').val('')
            $('#waypoint_position').val('')
            $('#waypoint_tot').val('')

            $('#waypointdlg').modal('hide')
        })
        event.preventDefault()
        return false
    })

    $('.dropdown').focusout(function(e) {
        if ($(this).has(e.relatedTarget).length === 0) {
            $('.dropdown-menu').dropdown('hide')
        }
    })

    $('#waypoint_name').keyup(function() {
        let menu = $('.dropdown-menu')
        let value = $(this).val()
        if (value.length < 2) {
            menu.dropdown('hide')
        } else {
            $.get(window.location.href + '/waypoints/?q=' + value, function(data) {
                if (data.length > 0) {
                    menu.empty()
                    data.forEach(function(value, index) {
                        menu.append('<a class="dropdown-item" href="#" data-pos="' + value['pos'] + '">' + value['name'] + '</a>')
                    })
                    menu.dropdown('show')
                    menu.dropdown('update')
                    $('.dropdown-item').click(function () {
                        $('#waypoint_name').val($(this).html())
                        $('#waypoint_position').val($(this).attr('data-pos'))
                        $('#waypoint_altitude').focus()
                        return false
                    })
                } else {
                    menu.dropdown('hide')
                }
            })
        }
    })
})
