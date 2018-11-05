SELECT a.dr_id        AS "dr_id",
       a.mistnost     AS "mistnost",
       a."DR_nazov"   AS "DR_nazov",
       a."short_name" AS "short_name",
       (a."mp") [ 1 ] AS "mp1",
       (a."t") [ 1 ]  AS "t1",
       (a."mp") [ 2 ] AS "mp2",
       (a."t") [ 2 ]  AS "t2",
       (a."mp") [ 3 ] AS "mp3",
       (a."t") [ 3 ]  AS "t3",
       (a."mp") [ 4 ] AS "mp4",
       (a."t") [ 4 ]  AS "t4"

FROM (SELECT team.number      AS "dr_id",
             R.name           AS "mistnost",
             team.name        AS "DR_nazov",
             S2.short_name    AS "short_name",
             array_agg(TM.mp) AS "mp",
             array_agg(TM.t)  AS "t"
      FROM public."Teams" team
             JOIN "CompetitionVenueRooms" C2 on team.competition_venue_room_id = C2.id
             JOIN (SELECT team_id, first_name || ' ' || last_name as mp, grade as t from "TeamMembers" TM) TM
               on team.id = TM.team_id
             JOIN "Schools" S2 on team.school_id = S2.id
             JOIN "Rooms" R on C2.room_id = R.id
      GROUP BY team.number, team.name, R.name, S2.short_name) a;

