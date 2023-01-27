/** 15990281923240769386 */
self.document = self;
self.window = self;
var ytcfg = {
    d: function() {
        return window.yt && yt.config_ || ytcfg.data_ || (ytcfg.data_ = {})
    },
    get: function(k, o) {
        return k in ytcfg.d() ? ytcfg.d()[k] : o
    },
    set: function() {
        var a = arguments;
        if (a.length > 1) ytcfg.d()[a[0]] = a[1];
        else
            for (var k in a[0]) ytcfg.d()[k] = a[0][k]
    }
};
ytcfg.set({
    "EXPERIMENT_FLAGS": {
        "H5_enable_full_pacf_logging": true,
        "H5_use_async_logging": true,
        "allow_skip_networkless": true,
        "background_thread_flush_logs_due_to_batch_limit": true,
        "change_ad_badge_to_stark": true,
        "clear_user_partitioned_ls": true,
        "deprecate_csi_has_info": true,
        "deprecate_two_way_binding_child": true,
        "deprecate_two_way_binding_parent": true,
        "desktop_image_cta_no_background": true,
        "desktop_log_img_click_location": true,
        "disable_child_node_auto_formatted_strings": true,
        "disable_pacf_logging_for_memory_limited_tv": true,
        "disable_simple_mixed_direction_formatted_strings": true,
        "disable_thumbnail_preloading": true,
        "enable_client_sli_logging": true,
        "enable_gel_log_commands": true,
        "enable_handles_account_menu_switcher": true,
        "enable_mixed_direction_formatted_strings": true,
        "enable_pacf_through_ybfe_web_logging_for_page_top": true,
        "enable_server_stitched_dai": true,
        "enable_skip_ad_guidance_prompt": true,
        "enable_skippable_ads_for_unplugged_ad_pod": true,
        "enable_sli_flush": true,
        "enable_smearing_expansion_dai": true,
        "enable_tectonic_ad_ux_for_halftime": true,
        "enable_third_party_info": true,
        "enable_topsoil_wta_for_halftime_live_infra": true,
        "export_networkless_options": true,
        "fill_single_video_with_notify_to_lasr": true,
        "gcf_config_store_enabled": true,
        "gpa_sparkles_ten_percent_layer": true,
        "h5_companion_enable_adcpn_macro_substitution_for_click_pings": true,
        "h5_inplayer_enable_adcpn_macro_substitution_for_click_pings": true,
        "h5_set_masthead_ads_asynchronously": true,
        "hide_endpoint_overflow_on_ytd_display_ad_renderer": true,
        "html5_control_flow_include_trigger_logging_in_tmp_logs": true,
        "html5_enable_ads_client_monitoring_log_tv": true,
        "html5_enable_single_video_vod_ivar_on_pacf": true,
        "html5_log_trigger_events_with_debug_data": true,
        "html5_recognize_predict_start_cue_point": true,
        "html5_server_stitched_dai_group": true,
        "html5_web_enable_halftime_preroll": true,
        "il_use_view_model_logging_context": true,
        "json_condensed_response": true,
        "kevlar_dropdown_fix": true,
        "kevlar_gel_error_routing": true,
        "kevlar_smart_downloads": true,
        "kevlar_smart_downloads_setting": true,
        "kevlar_sw_app_wide_fallback": true,
        "kevlar_vimio_use_shared_monitor": true,
        "log_errors_through_nwl_on_retry": true,
        "log_heartbeat_with_lifecycles": true,
        "log_web_endpoint_to_layer": true,
        "migrate_events_to_ts": true,
        "networkless_gel": true,
        "networkless_logging": true,
        "nwl_send_fast_on_unload": true,
        "nwl_send_from_memory_when_online": true,
        "offline_error_handling": true,
        "pageid_as_header_web": true,
        "parse_query_data_from_url": true,
        "polymer_bad_build_labels": true,
        "polymer_verifiy_app_state": true,
        "qoe_send_and_write": true,
        "record_app_crashed_web": true,
        "scheduler_use_raf_by_default": true,
        "skip_invalid_ytcsi_ticks": true,
        "skip_ls_gel_retry": true,
        "skip_setting_info_in_csi_data_object": true,
        "start_client_gcf": true,
        "start_client_gcf_for_player": true,
        "suppress_error_204_logging": true,
        "sw_nav_request_network_first": true,
        "transport_use_scheduler": true,
        "use_new_in_memory_storage": true,
        "use_new_nwl_initialization": true,
        "use_new_nwl_saw": true,
        "use_new_nwl_stw": true,
        "use_new_nwl_wts": true,
        "use_player_abuse_bg_library": true,
        "use_request_time_ms_header": true,
        "use_session_based_sampling": true,
        "use_shared_nsm": true,
        "use_shared_nsm_and_keep_yt_online_updated": true,
        "use_ts_visibilitylogger": true,
        "verify_ads_itag_early": true,
        "vss_final_ping_send_and_write": true,
        "vss_playback_use_send_and_write": true,
        "web_api_url": true,
        "web_dedupe_ve_grafting": true,
        "web_deprecate_service_ajax_map_dependency": true,
        "web_enable_voz_audio_feedback": true,
        "web_forward_command_on_pbj": true,
        "web_log_memory_total_kbytes": true,
        "web_one_platform_error_handling": true,
        "web_prefetch_preload_video": true,
        "web_yt_config_context": true,
        "ytidb_fetch_datasync_ids_for_data_cleanup": true,
        "H5_async_logging_delay_ms": 30000.0,
        "addto_ajax_log_warning_fraction": 0.1,
        "log_window_onerror_fraction": 0.1,
        "tv_pacf_logging_sample_rate": 0.01,
        "ytidb_transaction_ended_event_rate_limit": 0.02,
        "ytidb_transaction_ended_event_rate_limit_session": 0.2,
        "ytidb_transaction_ended_event_rate_limit_transaction": 0.1,
        "botguard_async_snapshot_timeout_ms": 3000,
        "check_navigator_accuracy_timeout_ms": 0,
        "initial_gel_batch_timeout": 2000,
        "max_prefetch_window_sec_for_livestream_optimization": 10,
        "min_prefetch_offset_sec_for_livestream_optimization": 20,
        "network_polling_interval": 30000,
        "polymer_log_prop_change_observer_percent": 0,
        "send_config_hash_timer": 0,
        "web_foreground_heartbeat_interval_ms": 28000,
        "web_logging_max_batch": 150,
        "web_smoothness_test_duration_ms": 0,
        "web_smoothness_test_method": 0,
        "ytidb_remake_db_retries": 3,
        "ytidb_reopen_db_retries": 3,
        "web_client_version_override": "",
        "kevlar_command_handler_command_banlist": [],
        "web_op_signal_type_banlist": []
    },
    "INNERTUBE_API_KEY": "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
    "INNERTUBE_API_VERSION": "v1",
    "INNERTUBE_CLIENT_NAME": "WEB",
    "INNERTUBE_CLIENT_VERSION": "2.20230126.00.00",
    "INNERTUBE_CONTEXT": {
        "client": {
            "clientName": "WEB",
            "clientVersion": "2.20230126.00.00"
        }
    },
    "INNERTUBE_CONTEXT_CLIENT_NAME": 1,
    "INNERTUBE_CONTEXT_CLIENT_VERSION": "2.20230126.00.00",
    "LATEST_ECATCHER_SERVICE_TRACKING_PARAMS": {
        "client.name": "WEB"
    }
});
window.ytcfg.obfuscatedData_ = [];
if (self.trustedTypes && self.trustedTypes.createPolicy) {
    const swPolicy = trustedTypes.createPolicy('youtubeServiceWorkerPolicy', {
        createScriptURL: function(ignored) {
            return 'https:\/\/www.youtube.com\/s\/desktop\/312652d3\/jsbin\/serviceworker-kevlar-appshell.vflset\/serviceworker-kevlar-appshell.js';
        }
    });
    importScripts(swPolicy.createScriptURL(''));
} else {
    importScripts('https:\/\/www.youtube.com\/s\/desktop\/312652d3\/jsbin\/serviceworker-kevlar-appshell.vflset\/serviceworker-kevlar-appshell.js');
}