# yai-media: serves the training videos (*.mp4 under public/experience/assets)
# for yaikh.com, so the website build no longer packs ~950 MB of video.
# The website proxies /experience/assets/**.mp4 and /assets/**.mp4 here over
# Railway's private network (see MEDIA_ORIGIN in next.config.mjs).
# This service only rebuilds when the videos change (Railway watch paths).
FROM alpine:3.20 AS pick
COPY public/experience/assets /src
RUN mkdir -p /out && cd /src && find . -name '*.mp4' | tar -cf - -T - | tar -xf - -C /out

FROM nginx:1.27-alpine
COPY media-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=pick /out /usr/share/nginx/html
