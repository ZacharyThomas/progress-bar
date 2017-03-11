import psycopg2
import time
from flask import Flask
from flask import request
from flask import jsonify

app = Flask(__name__)

status_dict = {}


@app.route('/upload', methods=['POST'])
def upload():
    conn = psycopg2.connect("dbname='uploader' host='localhost'")
    cur = conn.cursor()
    total_bytes = 0
    written_bytes = 0
    upload_id = request.form['uploadId']
    files = request.files

    sql = cur.mogrify("INSERT INTO progress (progress,upload_id) VALUES (%s, %s) returning id ",
                      (0.0, upload_id,))

    cur.execute(sql)
    pg_id = cur.fetchone()[0]
    conn.commit()

    for key in files.keys():
        file = files[key]
        file.seek(0, 2)
        file_length = file.tell()
        total_bytes += file_length
        file.seek(0, 0)
    for key in files.keys():
        file = files[key]
        with open("/Users/zachary.smith/uploader-backend/static/" + upload_id, 'w+') as destination:
            chunk = file.read(1024 * 1000)
            while len(chunk) != 0:
                destination.write(chunk.decode("utf-8"))
                written_bytes += len(chunk)
                chunk = file.read(1024 * 1000)
                sql = cur.mogrify("update progress set progress = %s where id = %s",
                                  (written_bytes / total_bytes, pg_id))
                cur.execute(sql)
                conn.commit()
                time.sleep(0.01)

    cur.close()
    conn.close()

    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/getStatus/<upload_id>', methods=['GET'])
def get_status(upload_id):
    conn = psycopg2.connect("dbname='uploader' host='localhost'")
    cur = conn.cursor()
    sql = cur.mogrify("select progress from progress where upload_id = %s",
                      (upload_id,))
    cur.execute(sql)
    progress = cur.fetchone()
    if progress is None:
        progress = 0
    else:
        progress = progress[0]

    cur.close()
    conn.close()

    response = jsonify({'data': progress})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(threaded=True)
